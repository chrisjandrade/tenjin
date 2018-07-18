const { webpackify, sassify } = require('./build'),
  chokidar = require('chokidar'),
  path = require('path');

function watch() {
  console.log('\n\nWatching for application code change...');

  // js watch
  const jsWatcher = chokidar.watch(
    ['*.js', '*.jsx', '*.json', '**/*.js', '**/*.jsx', '**/*.json'], {
      persistent: true,
      cwd: path.join(__dirname, '../src')
    });

  jsWatcher.
    on('change', path => recompileJS(path, 'changed')).
    on('unlink', path => recompileJS(path, 'deleted'));

  function recompileJS(path, action) {
    console.log('\t', path, 'was', action, 'recompiling JSX\n');
    return webpackify();
  }

  // scss watch
  const scssWatcher = chokidar.watch(
    ['*.scss', '**/*.scss'], { persistent: true, cwd: path.join(__dirname, '../src') });

  scssWatcher.
    on('change', path => recompileSASS(path, 'changed')).
    on('unlink', path => recompileSASS(path, 'deleted'));

  function recompileSASS(path, action) {
    console.log('\t', path, 'was', action, 'recompiling SASS\n');
    return sassify();
  }

};

setTimeout(() => watch(), 5000);