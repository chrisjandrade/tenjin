const _ = require('lodash'),
  FacialRecognition = require('../services/facial-recognition'),
  FileService = require('../services/file');

module.exports = function (config) {

  const controller = {

    facialRecognition: FacialRecognition(config),
    fileService: FileService(config),

    _findImageFiles: async function (dir) {
      const files = await controller.fileService.analyzeAllFiles(dir);

      return _.filter(files, file => 
        !!_.get(file, 'mimeType', '').match(/image/i));
    },

    _analyzeImage: async function (image) {
      const data = await controller.facialRecognition.analyzeImage(_.get(image, 'file'));
      return _.extend(image, data);
    },

    scrape: async function (req, res) {
      const { directory } = req.query;

      if (_.isEmpty(directory)) {
        res.status(400).json({
          error: 'Request expects query parameter "directory"'
        });
      } else {
        let images = await controller._findImageFiles(directory);
          
        try {
          res.json({
            images: await Promise.all(_.map(images, image => controller._analyzeImage(image)))
          });
        } catch (e) {
          res.status(500).json({
            error: `Unknown error occured while trying to scrape images from directory, ${e.message}`
          });
        }
      }
    }

  };

  return controller;
};
