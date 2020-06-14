const winston = require('winston');
const { NODE_ENV } = require('./config');


//Remember how our error handler created a helpful log of issues that occur while in development, but 
//in production doesn’t say much? Winston is where it’s getting that log, and just like the error handler 
//while we’re in production nothing much gets logged.  

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (!['production', 'test'].includes(NODE_ENV)) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
