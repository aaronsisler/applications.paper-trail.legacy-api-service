const { healthService } = require("./health-service");

exports.handler = (event, context, callback) => {
  const response = healthService();

  callback(null, response);
};
