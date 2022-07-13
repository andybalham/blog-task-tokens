/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import MockValuationService from './MockValuationService';

export type DataAccessStackProps = StackProps;

export default class TaskTokenTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'TaskTokenTestStack';

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      testStackId: TaskTokenTestStack.Id,
      ...props,
    });

    new MockValuationService(this, 'MockValuationService');
  }
}
