const Hapi = require('hapi'),
  path = require('path'),
  inert = require('inert');

module.exports = function (config) {

  const server = Hapi.Server({
    host: config.HOST,
    port: config.PORT,
    routes: {
      files: {
        relativeTo: path.join(__dirname, '../public')
      }
    }
  });

  async function provision() {
    try {
      server.logger = config.logger;
      await server.register(inert);

      server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
          directory: {
            path: '.',
            redirectToSlash: true,
            index: ['in']
          }
        }
      });

      await server.start();
      server.logger.info(`Tenjin running at ${config.HOST}:${config.PORT}`);
    } catch (e) {
      server.logger.error('An error occured trying to provision tenjin', e);
      Process.exit(1);
    }
  }

  provision();
  return server;
};
