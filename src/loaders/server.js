const http = require("http");

const logger = require("../../libs/logger");

const loadHttpServer = (app) => {
  const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  };

  const port = normalizePort(process.env.PORT || "8080");
  const server = http.createServer(app);

  app.set("port", port);

  server.listen(port);

  const onError = (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
      case "EACCES": {
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      }
      case "EADDRINUSE": {
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      }
      default: {
        throw error;
      }
    }
  };

  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string"
      ? `pipe ${addr}`
      : `port ${addr.port}`;

    logger.debug(`Listening on ${bind}`);
  };

  server.on("error", onError);
  server.on("listening", onListening);

  return server;
};

module.exports = loadHttpServer;
