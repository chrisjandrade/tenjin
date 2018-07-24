const _ = require('lodash'),
  FacialRecognition = require('../services/facial-recognition');

module.exports = function (config) {

  const controller = {

    fr: FacialRecognition(config),

    scrape: async function (req, res) {
      const { directory } = req.query;

      res.json({
        directory
      });
    }

  };

  return controller;
};
