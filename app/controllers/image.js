const _ = require('lodash'),
  path = require('path'),
  FacialRecognition = require('../services/facial-recognition'),
  FileService = require('../services/file'),
  DB = require('../services/db'),
  Elastic = require('../services/elastic'),
  { ImageModel } = require('../models/image');

module.exports = function (config) {

  const controller = {

    facialRecognition: FacialRecognition(config),
    fileService: FileService(config),
    db: DB(config),
    elastic: Elastic(config),

    init: _.once(function () {
      controller.db.connect();

      controller.elastic.connect().then(
        () => controller.elastic.createIndex());

      return controller;
    }),

    _findImageFiles: async function (dir) {
      const files = await controller.fileService.analyzeAllFiles(dir);

      return _.filter(files, file => 
        !!_.get(file, 'mimeType', '').match(/image/i));
    },

    _analyzeImage: async function (image) {
      const data = await controller.facialRecognition.analyzeImage(_.get(image, 'file'));
      return _.extend(image, data);
    },

    _persistImage: function (image) {
      return new Promise((resolve, reject) => {
        const { file, mimeType, facialRecognition } = image;

        ImageModel.create({ file, mimeType, metadata: [ facialRecognition ]}, (err, model) => {
          if (err) {
            reject(err);
          } else {
            resolve(Object.assign(image, { id: model.id }));
          }
        });
      });
    },

    scrape: async function (req, res) {
      const directory = path.join(__dirname, '../../data');

      if (_.isEmpty(directory)) {
        res.status(400).json({
          error: 'Request expects query parameter "directory"'
        });
      } else {
        res.json({ success: true });

        let images = await controller._findImageFiles(directory);
          
        try {
          const analyzedImages = await Promise.all(_.map(images, image => controller._analyzeImage(image))),
            savedImages = await Promise.all(_.map(analyzedImages, image => controller._persistImage(image)));

          controller.elastic.bulkIndex(savedImages);
        } catch (e) {
          console.error(`Unknown error occured while trying to scrape images from directory, ${e.message}`);
        }
      }
    }

  };

  return controller.init();
};
