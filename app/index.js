const express = require('express'),
  path = require('path');

module.exports = function (config) {

  const app = express();
  app.logger = config.logger;

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use('/', express.static('public/'));

	app.listen(config.PORT, config.HOST, () => {
    app.logger.info(`Tenjin is running at ${config.HOST} on port ${config.PORT}`);
  });

  return app;
};
