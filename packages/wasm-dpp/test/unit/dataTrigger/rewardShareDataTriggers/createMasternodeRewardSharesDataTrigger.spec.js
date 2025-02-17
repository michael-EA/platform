const SimplifiedMNListEntry = require('@dashevo/dashcore-lib/lib/deterministicmnlist/SimplifiedMNListEntry');
const getIdentityFixture = require('@dashevo/dpp/lib/test/fixtures/getIdentityFixture');
const createStateRepositoryMock = require('@dashevo/dpp/lib/test/mocks/createStateRepositoryMock');
const getMasternodeRewardShareDocumentsFixture = require('@dashevo/dpp/lib/test/fixtures/getMasternodeRewardShareDocumentsFixture');
const getMasternodeRewardSharesContractFixture = require('@dashevo/dpp/lib/test/fixtures/getMasternodeRewardSharesContractFixture');
const getDocumentTransitionsFixture = require('@dashevo/dpp/lib/test/fixtures/getDocumentTransitionsFixture');
const createRewardShareDataTrigger = require('@dashevo/dpp/lib/dataTrigger/rewardShareDataTriggers/createMasternodeRewardSharesDataTrigger');
const DataTriggerExecutionResult = require('@dashevo/dpp/lib/dataTrigger/DataTriggerExecutionResult');
const DataTriggerConditionError = require('@dashevo/dpp/lib/errors/consensus/state/dataContract/dataTrigger/DataTriggerConditionError');
const StateTransitionExecutionContext = require('@dashevo/dpp/lib/stateTransition/StateTransitionExecutionContext');

describe('createMasternodeRewardSharesDataTrigger', () => {
  let contextMock;
  let stateRepositoryMock;
  let documentTransition;
  let topLevelIdentityId;
  let smlStoreMock;
  let smlMock;
  let documentsFixture;
  let executionContext;

  beforeEach(function beforeEach() {
    topLevelIdentityId = Buffer.from('c286807d463b06c7aba3b9a60acf64c1fc03da8c1422005cd9b4293f08cf0562', 'hex');

    smlMock = {
      getQuorum: this.sinonSandbox.stub(),
      toSimplifiedMNListDiff: this.sinonSandbox.stub(),
      getQuorumsOfType: this.sinonSandbox.stub(),
      getValidMasternodesList: this.sinonSandbox.stub().returns([
        new SimplifiedMNListEntry({
          proRegTxHash: 'c286807d463b06c7aba3b9a60acf64c1fc03da8c1422005cd9b4293f08cf0562',
          confirmedHash: '4eb56228c535db3b234907113fd41d57bcc7cdcb8e0e00e57590af27ee88c119',
          service: '192.168.65.2:20101',
          pubKeyOperator: '809519c5f6f3be1c08782ac42ae9a83b6c7205eba43f9a96a4f032ec7a73f1a7c25fa78cce0d6d9c135f7e2c28527179',
          votingAddress: 'yXmprXYP51uzfMyndtWwxz96MnkCKkFc9x',
          isValid: true,
        }),
        new SimplifiedMNListEntry({
          proRegTxHash: 'a3e1edc6bd352eeaf0ae58e30781ef4b127854241a3fe7fddf36d5b7e1dc2b3f',
          confirmedHash: '27a0b637b56af038c45e2fd1f06c2401c8dadfa28ca5e0d19ca836cc984a8378',
          service: '192.168.65.2:20201',
          pubKeyOperator: '987a4873caba62cd45a2f7d4aa6d94519ee6753e9bef777c927cb94ade768a542b0ff34a93231d3a92b4e75ffdaa366e',
          votingAddress: 'ycL7L4mhYoaZdm9TH85svvpfeKtdfo249u',
          isValid: true,
        }),
      ]),
    };

    const dataContract = getMasternodeRewardSharesContractFixture();

    documentsFixture = getMasternodeRewardShareDocumentsFixture(undefined, undefined, dataContract);

    smlStoreMock = {
      getSMLbyHeight: this.sinonSandbox.stub().returns(smlMock),
      getCurrentSML: this.sinonSandbox.stub().returns(smlMock),
    };

    stateRepositoryMock = createStateRepositoryMock(this.sinonSandbox);
    stateRepositoryMock.fetchSMLStore.resolves(smlStoreMock);
    stateRepositoryMock.fetchIdentity.resolves(getIdentityFixture());
    stateRepositoryMock.fetchDocuments.resolves([]);

    const [document] = getMasternodeRewardShareDocumentsFixture(undefined, undefined, dataContract);

    [documentTransition] = getDocumentTransitionsFixture({
      create: [document],
    });

    executionContext = new StateTransitionExecutionContext();

    contextMock = {
      getStateRepository: () => stateRepositoryMock,
      getOwnerId: this.sinonSandbox.stub(),
      getDataContract: () => dataContract,
      getStateTransitionExecutionContext: () => executionContext,
    };
    contextMock.getOwnerId.returns(topLevelIdentityId);
  });

  it('should return an error if percentage > 10000', async () => {
    stateRepositoryMock.fetchDocuments.resolves(documentsFixture);
    // documentsFixture contains percentage = 500
    documentTransition.data.percentage = 9501;

    const result = await createRewardShareDataTrigger(
      documentTransition, contextMock,
    );

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(result.isOk()).to.be.false();

    const [error] = result.getErrors();

    expect(error).to.be.an.instanceOf(DataTriggerConditionError);
    expect(error.message).to.equal('Percentage can not be more than 10000');

    expect(stateRepositoryMock.fetchSMLStore).to.be.calledOnce();
    expect(stateRepositoryMock.fetchIdentity).to.be.calledOnceWithExactly(
      documentTransition.data.payToId,
      executionContext,
    );
  });

  it('should return an error if payToId does not exist', async () => {
    stateRepositoryMock.fetchIdentity.resolves(null);

    const result = await createRewardShareDataTrigger(
      documentTransition, contextMock,
    );

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(result.isOk()).to.be.false();

    const [error] = result.getErrors();

    expect(error).to.be.an.instanceOf(DataTriggerConditionError);
    expect(error.message).to.equal(`Identity ${documentTransition.data.payToId} doesn't exist`);

    expect(stateRepositoryMock.fetchSMLStore).to.be.calledOnce();
    expect(stateRepositoryMock.fetchIdentity).to.be.calledOnceWithExactly(
      documentTransition.data.payToId,
      executionContext,
    );
  });

  it('should return an error if ownerId is not a masternode identity', async () => {
    contextMock.getOwnerId.returns(getIdentityFixture().getId());

    const result = await createRewardShareDataTrigger(
      documentTransition, contextMock,
    );

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(result.isOk()).to.be.false();

    const [error] = result.getErrors();

    expect(error).to.be.an.instanceOf(DataTriggerConditionError);
    expect(error.message).to.equal('Only masternode identities can share rewards');

    expect(stateRepositoryMock.fetchSMLStore).to.be.calledOnce();
    expect(stateRepositoryMock.fetchIdentity).to.be.not.called();
  });

  it('should pass', async () => {
    const result = await createRewardShareDataTrigger(
      documentTransition, contextMock,
    );

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(result.isOk()).to.be.true();

    expect(stateRepositoryMock.fetchSMLStore).to.be.calledOnce();
    expect(stateRepositoryMock.fetchIdentity).to.be.calledOnceWithExactly(
      documentTransition.data.payToId,
      executionContext,
    );
  });

  it('should pass on dry run', async () => {
    stateRepositoryMock.fetchIdentity.resolves(null);

    executionContext.enableDryRun();

    const result = await createRewardShareDataTrigger(
      documentTransition, contextMock,
    );
    executionContext.disableDryRun();

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(result.isOk()).to.be.true();
    expect(stateRepositoryMock.fetchSMLStore).to.not.be.called();
    expect(stateRepositoryMock.fetchIdentity).to.be.calledOnceWithExactly(
      documentTransition.data.payToId,
      executionContext,
    );
  });

  it('should return an error if there are 16 stored shares', async () => {
    stateRepositoryMock.fetchDocuments.resolves(new Array(16).fill(0));

    const result = await createRewardShareDataTrigger(
      documentTransition, contextMock,
    );

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(result.isOk()).to.be.false();

    const [error] = result.getErrors();

    expect(error).to.be.an.instanceOf(DataTriggerConditionError);
    expect(error.message).to.equal('Reward shares cannot contain more than 16 identities');

    expect(stateRepositoryMock.fetchSMLStore).to.be.calledOnce();
    expect(stateRepositoryMock.fetchIdentity).to.be.calledOnceWithExactly(
      documentTransition.data.payToId,
      executionContext,
    );
  });
});
