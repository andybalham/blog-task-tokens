/* eslint-disable import/no-extraneous-dependencies */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface TaskTokenItem {
  keyReference: string;
  taskToken: string;
}

const documentClient = new DocumentClient();

export default class TaskTokenStore {
  constructor(private tableName?: string) {}

  async putAsync(taskTokenItem: TaskTokenItem): Promise<void> {
    //
    if (this.tableName === undefined)
      throw new Error('this.tableName === undefined');

    await documentClient
      .put({
        TableName: this.tableName,
        Item: taskTokenItem,
      })
      .promise();
  }

  async getAsync(keyReference: string): Promise<TaskTokenItem | undefined> {
    //
    if (this.tableName === undefined)
      throw new Error('this.tableName === undefined');

    const getItemInput = { TableName: this.tableName, Key: { keyReference } };

    const getItemOutput = await documentClient.get(getItemInput).promise();

    return getItemOutput.Item === undefined
      ? undefined
      : (getItemOutput.Item as TaskTokenItem);
  }
}
