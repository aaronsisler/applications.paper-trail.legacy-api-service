import aws, { DynamoDB } from "aws-sdk";
import { ItemList } from "aws-sdk/clients/dynamodb";

import { DatabaseItem } from "../../models/database-item";
import { KeyValuePair } from "../../models/key-value-pair";
import { errorLogger } from "../../utils/error-logger";
import { rawTransactions } from "../../mocks/raw-transactions";

class DatabaseService {
  private documentClient: DynamoDB.DocumentClient;

  constructor() {
    aws.config.update({ region: "us-east-1" });
    this.documentClient = new aws.DynamoDB.DocumentClient();
  }

  async create(
    table: string,
    keyValuePair: KeyValuePair,
    item: DatabaseItem
  ): Promise<void> {
    try {
      const key = { [keyValuePair.getKey()]: keyValuePair.getValue() };
      const params = {
        TableName: table,
        Key: key,
        Item: { ...item, ...key }
      };
      await this.documentClient.put(params).promise();
    } catch (error) {
      errorLogger("DatabaseService", error);
      throw new Error("Record not created");
    }
  }

  async createNew(
    table: string
    // keyValuePair: KeyValuePair,
    // item: DatabaseItem
  ): Promise<void> {
    try {
      const [transaction] = rawTransactions;
      const key = {
        userId: "101389202411803829037",
        transactionId: "beada485-e3a4-4c20-911d-9a9901473432"
      };
      // const key = { [keyValuePair.getKey()]: keyValuePair.getValue() };
      const params = {
        TableName: table,
        Key: key,
        Item: { ...transaction, ...key },
        ConditionExpression: `attribute_not_exists(#hashKey) AND attribute_not_exists(#rangeKey)`,
        ExpressionAttributeNames: {
          "#hashKey": "userId",
          "#rangeKey": "transactionId"
        }
      };
      await this.documentClient.put(params).promise();
    } catch (error) {
      errorLogger("DatabaseService", error);
      throw new Error("Record not created");
    }
  }

  async read(table: string, filterCondition: KeyValuePair): Promise<ItemList> {
    try {
      const params = {
        TableName: table,
        KeyConditionExpression: "#keyName = :keyValue",
        ExpressionAttributeNames: {
          "#keyName": filterCondition.getKey()
        },
        ExpressionAttributeValues: {
          ":keyValue": filterCondition.getValue()
        }
      };

      const { Items: items } = await this.documentClient
        .query(params)
        .promise();

      return items;
    } catch (error) {
      errorLogger("DatabaseService", error);
      throw new Error("Records not found");
    }
  }

  async update(
    table: string
    // keyValuePair: KeyValuePair[],
    // itemKey: string
  ): Promise<void> {
    try {
      const [transaction] = rawTransactions;
      const key = {
        userId: "101389202411803829037",
        transactionId: "beada485-e3a4-4c20-911d-9a9901473432"
      };
      const params = {
        TableName: table,
        Key: key,
        // KeyConditionExpression: 'device_id = :id',
        Item: { ...transaction, ...key, amount: 45 },
        ConditionExpression: `attribute_exists(#hashKey) AND attribute_exists(#rangeKey)`,
        ExpressionAttributeNames: {
          "#hashKey": "userId",
          "#rangeKey": "transactionId"
        }
      };
      console.log(params);
      await this.documentClient.put(params).promise();
      // const key = { [keyValuePair.getKey()]: keyValuePair.getValue() };
      // const params = {
      //   TableName: table,
      //   Key: key,
      //   UpdateExpression: `SET #itemKey = :newItem`,
      //   ExpressionAttributeNames: { "#itemKey": itemKey },
      //   ExpressionAttributeValues: {
      //     ":newItem": { amount: 789.99 }
      //   }
      // };

      // const response = await this.documentClient.update(params).promise();
      // console.log(response);

      return;
    } catch (error) {
      errorLogger("DatabaseService", error);
      throw new Error("Record not updated");
    }
  }
}

export { DatabaseService };
