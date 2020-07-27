const { healthService } = require("../../services/health");

exports.health = (event, context, callback) => {
  const response = healthService();

  callback(null, response);
};
