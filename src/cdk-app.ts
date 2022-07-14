/* eslint-disable no-new */
import { App, Tags } from 'aws-cdk-lib';
import TaskTokenTestStack from './TaskTokenTestStack';

const app = new App();
Tags.of(app).add('app', 'BlogTaskTokensApp');

new TaskTokenTestStack(app, 'TaskTokenTestStack', {});
