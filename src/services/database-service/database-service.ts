import aws, { DynamoDB } from "aws-sdk";

import { DatabaseItem } from "../../models/database-item";
import { DATABASE_TABLE_USERS } from "../../config";
import { errorLogger } from "../../utils/error-logger";

interface Params {
  TableName: string;
  Key: DatabaseItem;
  ProjectionExpression?: string;
}

class DatabaseService {
  private documentClient: DynamoDB.DocumentClient;

  private usersTable: string = DATABASE_TABLE_USERS;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.documentClient = new aws.DynamoDB.DocumentClient();
  }

  async create(
    table: string,
    key: Record<string, string>,
    item: DatabaseItem
  ): Promise<void> {
    try {
      const params = {
        TableName: table,
        Key: key,
        Item: { ...key, ...item }
      };
      await this.documentClient.put(params).promise();
    } catch (error) {
      errorLogger("DatabaseService", error);
      throw error;
    }
  }

  // async update(
  //   key: string,
  //   value: string,
  //   itemAttribute: string,
  //   itemKey: string,
  //   itemValue: DatabaseItem
  // ): Promise<DatabaseItem> {
  //   try {
  //     const params = {
  //       TableName: this.tableName,
  //       Key: { [key]: value },
  //       UpdateExpression: `SET ${itemAttribute}.#itemKey = :newItem`,
  //       ExpressionAttributeNames: { "#itemKey": itemKey },
  //       ExpressionAttributeValues: {
  //         ":newItem": { amount: 789.99 }
  //       },
  //       ConditionExpression: `attribute_exists(${itemAttribute}.#itemKey)`
  //     };

  //     const response = await this.documentClient.update(params).promise();
  //     console.log(response);

  //     return;
  //   } catch (error) {
  //     errorLogger("DatabaseService", error);
  //   }
  // }

  async read(
    key: string,
    value: string,
    itemAttribute: string
  ): Promise<DatabaseItem> {
    try {
      const params = this.getParams(key, value, itemAttribute);

      const { Item: item } = await this.documentClient.get(params).promise();

      return item;
    } catch (error) {
      errorLogger("DatabaseService", error);
    }

    return undefined;
  }

  private getParams(key: string, value: string, itemAttribute: string): Params {
    const paramKey = { [key]: value };
    return {
      TableName: this.usersTable,
      Key: paramKey,
      ProjectionExpression: itemAttribute
    };
  }
}

export { DatabaseService };
