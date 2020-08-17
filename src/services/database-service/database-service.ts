import aws, { DynamoDB } from "aws-sdk";

import { DatabaseValue } from "../../models/database-value";
import { DatabaseItem } from "../../models/database-item";
import { DATABASE_TABLE } from "../../config";
import { DatabaseTypes } from "../../constants";

interface Params {
  TableName: string;
  Key: DatabaseItem;
}

class DatabaseService {
  private dynamoDB: DynamoDB;
  private tableName: string = DATABASE_TABLE;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.dynamoDB = new aws.DynamoDB({ apiVersion: "2012-08-10" });
  }

  async getItem(
    key: string,
    value: DatabaseValue,
    options?: any
  ): Promise<DatabaseItem> {
    try {
      const params = this.getParams(key, value, options);
      const { Item: item } = await this.dynamoDB.getItem(params).promise();

      return item;
    } catch (error) {
      console.log("ERROR: DatabaseService"); // TODO figure out AWS logging
      console.log(error);
    }

    return undefined;
  }

  private getParams(key: string, value: DatabaseValue, options?: any): Params {
    const valueType = this.getValueType(value);
    const paramKey = { [key]: { [valueType]: value } };
    return Object.assign(
      {},
      { TableName: this.tableName },
      { Key: paramKey },
      options
    );
  }

  private getValueType(value: DatabaseValue): string {
    switch (typeof value) {
      case "number":
        return DatabaseTypes.NUMBER;
      case "boolean":
        return DatabaseTypes.BOOLEAN;
      case "string":
      default:
        return DatabaseTypes.STRING;
    }
  }
}

export { DatabaseService };
