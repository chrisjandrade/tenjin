const mongoose = require('mongoose');

module.exports = (config => {

  const service = {

    connect: function () {
      return new Promise((resolve, reject) => {
        const { URI } = config.DB;

        mongoose.connect(URI || 'mongodb://localhost:27017/tenjin', { useNewUrlParser: true });
        mongoose.connection.on('open', () => {
          service.connected = true;
          resolve();
        });
        mongoose.connection.on('error', () => reject());
      });
    }

  };

  return service;
});
