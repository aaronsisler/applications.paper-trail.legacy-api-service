const aws = require("aws-sdk");

const region = "us-east-1";

aws.config.update({ region });

const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

const params = {
  TableName: "TABLE",
  Key: {
    userId: { N: "123" }
  },
  ProjectionExpression: "ATTRIBUTE_NAME"
};

// Call DynamoDB to read the item from the table
ddb.getItem(params, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Item);
  }
});
