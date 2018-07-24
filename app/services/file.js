const glob = require('glob'),
  mmm = require('mmmagic'),
  _ = require('lodash');

module.exports = function (config) {

  const service = {

    SCRAPE_DIR_POSTFIX: config.SCRAPE_DIR_POSTFIX,

    _glob: function (patt, options) {
      return new Promise((resolve, reject) => {
        glob(patt, options, (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      });
    },

    _magic: function (fd) {
      const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
      
      return new Promise((resolve, reject) => {
        magic.detectFile(fd, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    },

    _analyzeFile: async function (fd) {
      const mimeType = await service._magic(fd);
      
      return {
        file: fd,
        mimeType
      };
    },

    analyzeAllFiles: async function (baseDir) {
      const files = await service.listAllFiles(baseDir),
        records = await Promise.all(
          _.map(files, file => service._analyzeFile(file)));

      return records;
    },

    listAllFiles: async function (baseDir) {
      return await service._glob(`${baseDir}/${service.SCRAPE_DIR_POSTFIX}`, {});
    }

  };

  return service;
};
