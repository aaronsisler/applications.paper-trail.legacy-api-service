import aws, { DynamoDB } from "aws-sdk";

import { DatabaseValue } from "../../models/database-value";
import { DatabaseItem } from "../../models/database-item";
import { DATABASE_TABLE } from "../../config";

interface Params {
  TableName: string;
  Key: DatabaseItem;
}

class DatabaseService {
  private documentClient: DynamoDB.DocumentClient;
  private _tableName: string = DATABASE_TABLE;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.documentClient = new aws.DynamoDB.DocumentClient();
  }

  async create(key: string, value: DatabaseValue): Promise<any> {
    try {
      const transId = "789";
      const params = Object.assign(
        {},
        { TableName: this.tableName },
        { Key: { userId: "123" } },
        { UpdateExpression: "SET transactions.#transId = :newTrans" },
        { ExpressionAttributeNames: { "#transId": transId } },
        {
          ExpressionAttributeValues: {
            ":newTrans": { amount: 789.99 }
          }
        },
        { ConditionExpression: "attribute_not_exists(transactions.#transId)" }
      );

      const response = await this.documentClient.update(params).promise();
      console.log(response);

      return;
    } catch (error) {
      console.log("ERROR: DatabaseService");
      console.log(error);
    }

    return;
  }

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
      console.log("ERROR: DatabaseService");
      console.log(error);
    }

    return undefined;
  }

  private getParams(
    key: string,
    value: DatabaseValue,
    itemAttribute: string
  ): Params {
    const paramKey = { [key]: value };
    const returnedParams = Object.assign(
      {},
      { TableName: this.tableName },
      { Key: paramKey },
      { ProjectionExpression: itemAttribute }
    );
    return returnedParams;
  }

  get tableName(): string {
    return this._tableName;
  }
}

export { DatabaseService };
