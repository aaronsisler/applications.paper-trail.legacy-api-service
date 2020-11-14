import aws, { DynamoDB } from "aws-sdk";

import { DatabaseValue } from "../../models/database-value";
import { DatabaseItem } from "../../models/database-item";
import { DATABASE_TABLE } from "../../config";
import { errorLogger } from "../../utils/error-logger";

interface Params {
  TableName: string;
  Key: DatabaseItem;
  ProjectionExpression?: string;
}

class DatabaseService {
  private documentClient: DynamoDB.DocumentClient;

  private tableName: string = DATABASE_TABLE;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.documentClient = new aws.DynamoDB.DocumentClient();
  }

  // async create(key: string, value: DatabaseValue): Promise<any> {
  //   try {
  //     const transId = "789";
  //     const params = {
  //       TableName: this.tableName,
  //       Key: { userId: "123" },
  //       UpdateExpression: "SET transactions.#transId = :newTrans",
  //       ExpressionAttributeNames: { "#transId": transId },
  //       ExpressionAttributeValues: {
  //         ":newTrans": { amount: 789.99 }
  //       },
  //       ConditionExpression: "attribute_not_exists(transactions.#transId)"
  //     };

  //     const response = await this.documentClient.put(params).promise();
  //     console.log(Response);

  //     return;
  //   } catch (error) {
  //     errorLogger("DatabaseService", error);
  //   }

  //   return;
  // }

  async read(
    key: string,
    value: DatabaseValue,
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

  private getParams(
    key: string,
    value: DatabaseValue,
    itemAttribute: string
  ): Params {
    const paramKey = { [key]: value };
    return {
      TableName: this.tableName,
      Key: paramKey,
      ProjectionExpression: itemAttribute
    };
  }
}

export { DatabaseService };
