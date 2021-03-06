const express = require('express');

const ImageController = require('./controllers/image');

module.exports = function (config) {

  const app = express();
  app.logger = config.logger;

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use('/', express.static('public/'));

  app.imageController = ImageController(config);
  app.put('/api/image/scrape', app.imageController.scrape);

	app.listen(config.PORT, config.HOST, () => {
    app.logger.info(`Tenjin is running at ${config.HOST} on port ${config.PORT}`);
  });

  return app;
};
