const _ = require('lodash'),
  FacialRecognition = require('../services/facial-recognition'),
  FileService = require('../services/file'),
  logger = require('../../logger'),
  config = require('../../config');

(function start() {

  const processor = {
    logger,
    facialRecognition: FacialRecognition(config),
    fileService: FileService(config),

    process: async function ({ directory, ...rest }) {
      if (_.isEmpty(directory)) {
        processor.logger.error('directory is required');
        processor.notify({ error: 'Directory must not be empty' });
      } else {
        processor.logger.info('Scanning directory', directory);
        let images = await processor._findImageFiles(directory);
        processor.logger.info(`Found ${images.length} images`, images);
        
        try {
          processor.notify({
            results: await Promise.all(_.map(images, image => controller._analyzeImage(image)))
          });
        } catch (e) {
          processor.notify({
            error: `Unknown error occured while trying to scrape images from directory, ${e.message}`
          });
        }
      }
    },

    notify: function (message) {
      process.send(message);
    },

    _findImageFiles: async function (dir) {
      const files = await processor.fileService.analyzeAllFiles(dir);

      return _.filter(files, file => 
        !!_.get(file, 'mimeType', '').match(/image/i));
    },

    _analyzeImage: async function (image) {
      const data = await processor.facialRecognition.analyzeImage(_.get(image, 'file'));
      return _.extend(image, data);
    }

  };

  process.on('message', processor.process);

}());