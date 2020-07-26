const { healthService } = require("../../services/health-service");

exports.handler = (event, context, callback) => {
  const response = healthService();

  callback(null, response);
};
