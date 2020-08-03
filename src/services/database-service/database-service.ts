import aws, { DynamoDB } from "aws-sdk";

import { DatabaseValue } from "../../models/database-value";
import { DatabaseItem } from "../../models/database-item";

interface Params {
  TableName: string;
  Key: DatabaseItem;
}

class DatabaseService {
  private dynamoDB: DynamoDB;
  private tableName: string = "PAPER_TRAIL_SERVICE_POC";

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.dynamoDB = new aws.DynamoDB({ apiVersion: "2012-08-10" });
  }

  async getItem(key: string, value: DatabaseValue): Promise<DatabaseItem> {
    try {
      const params = this.getParams(key, value);
      const { Item: item } = await this.dynamoDB.getItem(params).promise();

      return item;
    } catch (error) {
      console.log("ERROR: DatabaseService"); // TODO figure out AWS logging
      console.log(error);
    }

    return undefined;
  }

  private getParams(key: string, value: DatabaseValue): Params {
    const valueType = this.getValueType(value);
    const paramKey = { [key]: { [valueType]: value } };
    return { TableName: this.tableName, Key: paramKey };
  }

  private getValueType(value: DatabaseValue): string {
    switch (typeof value) {
      case "number":
        return "N";
      case "boolean":
        return "B";
      case "string":
      default:
        return "S";
    }
  }
}

export { DatabaseService };
