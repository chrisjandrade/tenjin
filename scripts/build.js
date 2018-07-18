const webpack = require('webpack'),
  sass = require('node-sass'),
  fs = require('fs-extra'),
  uglifyJS = require('uglify-js'),
  CleanCSS = require('clean-css');

/**
 * Compiles the gui
 */
function webpackify() {
  const config = require('../webpack.conf.js');

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(stats.toJson().errors.toString());
        reject(err || stats.hasErrors());
      } else {
        console.log('JS Compliation done.')
        resolve();
      }
    });
  });
}

/**
 * Compiles the scss files to css
 */
function sassify() {
  return new Promise((resolve, reject) => {
    sass.render({
      file: 'src/App.scss',
      outFile: 'public/css/App.css',
      sourcemap: true
    }, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        fs.outputFile('public/css/App.css', result.css, err => {
          if (err) {
            console.error(err.toString());
            reject(err);
          } else {
            console.log('SASS compliation done.')
            resolve();
          }
        });
      }
    })
  });
}

/**
 * Minify the javascript
 */
function minifyJS() {
  console.log('Uglifying JS...');

  return new Promise((resolve, reject) => {
    fs.readFile('public/js/bundle.js', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const result = uglifyJS.minify(data);
        if (result.error) {
          reject(result.error);
        } else {
          fs.writeFile('public/js/bundle.js', result.code, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      }
    });
  });
}

function minifyCSS() {
  console.log('Uglifying CSS...');

  return new Promise((resolve, reject) => {
    const output = new CleanCSS().minify(['public/css/App.css']);

    fs.writeFile('public/css/App.css', output.styles, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Build the application
 */
(function build() {
  webpackify().then(
  () => sassify()).then(
  () => {
    if (process.env.NODE_ENV === 'production') {
      return minifyJS().then(
        () => minifyCSS());
    } else {
      return Promise.resolve();
    }
  }).then(
  () => console.log('Application has been built.'));
}());

module.exports = { webpackify, sassify };
