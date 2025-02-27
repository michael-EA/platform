const getIdentityTopUpTransitionFixture = require('@dashevo/dpp/lib/test/fixtures/getIdentityTopUpTransitionFixture');

const validateIdentityTopUpTransitionStateFactory = require(
  '@dashevo/dpp/lib/identity/stateTransition/IdentityTopUpTransition/validation/state/validateIdentityTopUpTransitionStateFactory',
);

describe('validateIdentityTopUpTransitionStateFactory', () => {
  let validateIdentityTopUpTransitionState;
  let stateTransition;

  beforeEach(() => {
    validateIdentityTopUpTransitionState = validateIdentityTopUpTransitionStateFactory();

    stateTransition = getIdentityTopUpTransitionFixture();
  });

  it('should return valid result', async () => {
    const result = await validateIdentityTopUpTransitionState(stateTransition);

    expect(result.isValid()).to.be.true();
  });
});
