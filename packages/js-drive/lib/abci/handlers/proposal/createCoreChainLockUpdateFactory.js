const {
  tendermint: {
    types: {
      CoreChainLock,
    },
  },
} = require('@dashevo/abci/types');
/**
 *
 * @param {ProposalBlockExecutionContextCollection} proposalBlockExecutionContextCollection
 * @param {LatestCoreChainLock} latestCoreChainLock
 * @return {createCoreChainLockUpdate}
 */
function createCoreChainLockUpdateFactory(
  proposalBlockExecutionContextCollection,
  latestCoreChainLock,
) {
  /**
   * @typedef createCoreChainLockUpdate
   * @param {number} round
   * @param {BaseLogger} logger
   * @return {Promise<CoreChainLock>}
   */
  async function createCoreChainLockUpdate(round, consensusLogger) {
    // Update Core Chain Locks
    const proposalBlockExecutionContext = proposalBlockExecutionContextCollection.get(round);
    const contextCoreChainLockedHeight = proposalBlockExecutionContext.getCoreChainLockedHeight();
    const coreChainLock = latestCoreChainLock.getChainLock();

    let coreChainLockUpdate;
    if (coreChainLock && coreChainLock.height > contextCoreChainLockedHeight) {
      coreChainLockUpdate = new CoreChainLock({
        coreBlockHeight: coreChainLock.height,
        coreBlockHash: coreChainLock.blockHash,
        signature: coreChainLock.signature,
      });

      consensusLogger.trace(
        {
          nextCoreChainLockHeight: coreChainLock.height,
        },
        `Provide next chain lock for Core height ${coreChainLock.height}`,
      );
    }

    return coreChainLockUpdate;
  }

  return createCoreChainLockUpdate;
}

module.exports = createCoreChainLockUpdateFactory;
