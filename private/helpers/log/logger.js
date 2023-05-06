const winston = require('winston');

const logger = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        trace: 4,
      },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'ecentials-api-v1' },
    transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
});

module.exports = logger;
