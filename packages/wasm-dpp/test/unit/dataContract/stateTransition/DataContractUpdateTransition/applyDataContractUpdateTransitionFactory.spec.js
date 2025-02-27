const DataContractUpdateTransition = require(
  '@dashevo/dpp/lib/dataContract/stateTransition/DataContractUpdateTransition/DataContractUpdateTransition',
);

const getDataContractFixture = require('@dashevo/dpp/lib/test/fixtures/getDataContractFixture');

const applyDataContractUpdateTransitionFactory = require(
  '@dashevo/dpp/lib/dataContract/stateTransition/DataContractUpdateTransition/applyDataContractUpdateTransitionFactory',
);

const createStateRepositoryMock = require('@dashevo/dpp/lib/test/mocks/createStateRepositoryMock');
const StateTransitionExecutionContext = require('@dashevo/dpp/lib/stateTransition/StateTransitionExecutionContext');

describe('applyDataContractUpdateTransitionFactory', () => {
  let stateTransition;
  let dataContract;
  let stateRepositoryMock;
  let applyDataContractUpdateTransition;
  let executionContext;

  beforeEach(function beforeEach() {
    dataContract = getDataContractFixture();

    stateTransition = new DataContractUpdateTransition({
      dataContract: dataContract.toObject(),
    });

    executionContext = new StateTransitionExecutionContext();

    stateTransition.setExecutionContext(executionContext);

    stateRepositoryMock = createStateRepositoryMock(this.sinonSandbox);

    applyDataContractUpdateTransition = applyDataContractUpdateTransitionFactory(
      stateRepositoryMock,
    );
  });

  it('should store a data contract from state transition in the repository', async () => {
    await applyDataContractUpdateTransition(stateTransition);

    expect(stateRepositoryMock.storeDataContract).to.have.been.calledOnceWithExactly(
      stateTransition.getDataContract(),
      executionContext,
    );
  });
});
