This is a companion repo for the blog post on implementing task tokens using CDK.

To build and deploy the application:

```
npm i
npm run cdk-deploy
```

To run the unit tests in `LoanProcessor.test.ts`, you will need to create a `.env` file in the root directory that specifies the region you have deployed to. For example:

```
AWS_REGION=eu-west-2
```
