const aws = require("aws-sdk");

exports.databaseService = async () => {
  const region = "us-east-1";

  aws.config.update({ region });

  const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

  const params = {
    TableName: "PAPER_TRAIL_SERVICE_POC",
    Key: {
      userId: { S: "123" }
    }
  };

  try {
    const { Item: item } = await ddb.getItem(params).promise();
    return { statusCode: 200, body: item };
  } catch (err) {
    return {
      statusCode: 500,
      body: { message: "Something went wrong", error: err }
    };
  }
};
