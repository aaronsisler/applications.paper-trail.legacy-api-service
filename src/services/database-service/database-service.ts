import aws, { DynamoDB } from "aws-sdk";

class DatabaseService {
  private ddb: DynamoDB;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });
  }

  async getItem(params: any) {
    try {
      const { Item: item } = await this.ddb.getItem(params).promise();

      return item;
    } catch (error) {
      console.log("ERROR"); // TODO figure out AWS logging
    }

    return undefined;
  }
}

export { DatabaseService };
