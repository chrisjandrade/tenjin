const elasticsearch = require('elasticsearch');

module.exports = function (config) {

  const service = {

    connect: function () {
      return new Promise((resolve, reject) => {

        const client = new elasticsearch.Client({
          host: 'localhost:9200',
          log: 'error'
        });

        client.ping({ requestTimeout: 30000 }, err => {
          if (err) {
            service.conected = false;
            reject(err)
          } else {
            Object.assign(service, {
              connected: true,
              client
            });
            


            resolve(client);
          }
        });

      });
    },

    createIndex: async function () {
      const exists = await service.indexExists();

      if (!exists) {
        return service.client.indices.create({ index: 'tenjin' });
      } else {
        return Promise.resolve();
      }
    },

    indexExists: function () {
      return service.client.indices.exists({ index: 'tenjin' });
    }

  };

  return service;

};

