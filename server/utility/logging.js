const winston = require("winston");

winston.level = process.env.LOG_LEVEL;
const debug = require("debug")("application");

// if (process.env.DEPLOY_MODE !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple()
//   }));
// }
module.exports = { logger: winston, debug };
