const winston = require('winston');
const config = require(`${__config}/config.js`);

winston.emitErrs = true;

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
          level: config.logLevel,
          handleExceptions: true,
          humanReadableUnhandledException: true,
          json: false,
          colorize: true
        }),
        new winston.transports.File({
          level: config.logLevel,
          filename: 'game-hook.log'
        })
    ],
    handleExceptions: true,
    exitOnError: false
});

module.exports = logger;
