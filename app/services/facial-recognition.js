const fr = require('face-recognition'),
  _ = require('lodash');

module.exports = function (config) {

  const service = {

    detector: fr.AsyncFaceDetector(),
    logger: config.logger,

    analyzeImages: async function (paths) {
      return await Promise.all(
        _.map(paths, fd => service.analyzeImage(fd)));
    },

    analyzeImage: async function (fd) {
      const image = service.loadImage(fd),
        faceRectangles = await service.locateFaces(image),
        faceImages = await service.detectFaces(image);
      
      return {
        file: fd,
        facialRecognition: { faceRectangles, faceImages }
      };
    },

    loadImage: function (fd) {
      return fr.loadImage(fd);
    },

    locateFaces: async function (image) {
      let faces = [];

      try {
        faces = await service.detector.locateFaces(image);
      } catch (e) {
        service.logger.error('Couldn\'t locate faces', e);
      }

      return faces;
    },

    detectFaces: async function (image) {
      let faceImages = [];

      try {
        faceImages = await service.detector.detectFaces(image);
      } catch (e) {
        service.logger.error('Couldn\'t detect faces', e);
      }

      return faceImages;
    }

  };

  return service;
};
