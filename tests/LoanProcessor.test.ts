import {
  IntegrationTestClient,
  StepFunctionsTestClient,
} from '@andybalham/cdk-cloud-test-kit';
import { nanoid } from 'nanoid';
import { LoanApplication } from 'src/LoanApplication';
import TaskTokenTestStack from '../src/TaskTokenTestStack';

jest.setTimeout(30 * 1000);

describe('TaskTokenTestStack Test Suite', () => {
  //
  const testClient = new IntegrationTestClient({
    testStackId: TaskTokenTestStack.Id,
  });

  let loanProcessorStateMachine: StepFunctionsTestClient;

  beforeAll(async () => {
    await testClient.initialiseClientAsync();

    loanProcessorStateMachine = testClient.getStepFunctionsTestClient(
      TaskTokenTestStack.LoanProcessorStateMachineId
    );
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();
  });

  it('tests', async () => {
    // Arrange

    const loanApplication: LoanApplication = {
      applicationReference: `app-${nanoid()}`,
      property: {
        nameOrNumber: '999',
        postcode: 'PO1 1CE',
      },
    };

    // Act

    await loanProcessorStateMachine.startExecutionAsync(loanApplication);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => loanProcessorStateMachine.isExecutionFinishedAsync(),
    });

    // Assert

    expect(timedOut).toEqual(false);

    const status = await loanProcessorStateMachine.getStatusAsync();

    expect(status).toEqual('SUCCEEDED');
  });
});
