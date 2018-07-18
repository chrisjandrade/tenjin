const { createLogger, transports, format } = require('winston'),
  { Console, File } = transports,
  moment = require('moment');

module.exports = (function () {

  const logger = createLogger({
    transports: [
      new Console({
        format: format.simple()
      })
    ]
  });

  return logger;
}());
