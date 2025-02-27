const { PublicKey } = require('@dashevo/dashcore-lib');
const Identity = require('@dashevo/dpp/lib/identity/Identity');
const IdentityCreateTransition = require('@dashevo/dpp/lib/identity/stateTransition/IdentityCreateTransition/IdentityCreateTransition');
const IdentityTopUpTransition = require('@dashevo/dpp/lib/identity/stateTransition/IdentityTopUpTransition/IdentityTopUpTransition');

const getIdentityFixture = require('@dashevo/dpp/lib/test/fixtures/getIdentityFixture');

const ValidationResult = require('@dashevo/dpp/lib/validation/ValidationResult');
const SerializedObjectParsingError = require('@dashevo/dpp/lib/errors/consensus/basic/decode/SerializedObjectParsingError');

const InvalidIdentityError = require(
  '@dashevo/dpp/lib/identity/errors/InvalidIdentityError',
);
const getInstantAssetLockProofFixture = require('@dashevo/dpp/lib/test/fixtures/getInstantAssetLockProofFixture');
const InstantAssetLockProof = require('@dashevo/dpp/lib/identity/stateTransition/assetLockProof/instant/InstantAssetLockProof');
const getChainAssetLockProofFixture = require('@dashevo/dpp/lib/test/fixtures/getChainAssetLockProofFixture');
const createDPPMock = require('@dashevo/dpp/lib/test/mocks/createDPPMock');
const SomeConsensusError = require('@dashevo/dpp/lib/test/mocks/SomeConsensusError');
const IdentityFactory = require('@dashevo/dpp/lib/identity/IdentityFactory');
const IdentityUpdateTransition = require('@dashevo/dpp/lib/identity/stateTransition/IdentityUpdateTransition/IdentityUpdateTransition');
const IdentityPublicKey = require('@dashevo/dpp/lib/identity/IdentityPublicKey');

describe('IdentityFactory', () => {
  let factory;
  let validateIdentityMock;
  let decodeProtocolEntityMock;
  let identity;
  let instantAssetLockProof;
  let chainAssetLockProof;
  let dppMock;
  let fakeTime;

  beforeEach(function beforeEach() {
    validateIdentityMock = this.sinonSandbox.stub();
    decodeProtocolEntityMock = this.sinonSandbox.stub();

    instantAssetLockProof = getInstantAssetLockProofFixture();
    chainAssetLockProof = getChainAssetLockProofFixture();

    dppMock = createDPPMock();

    factory = new IdentityFactory(
      dppMock,
      validateIdentityMock,
      decodeProtocolEntityMock,
    );

    identity = getIdentityFixture();
    identity.id = instantAssetLockProof.createIdentifier();
    identity.setAssetLockProof(instantAssetLockProof);
    identity.setBalance(0);

    fakeTime = this.sinonSandbox.useFakeTimers(new Date());
  });

  afterEach(() => {
    fakeTime.reset();
  });

  describe('#constructor', () => {
    it('should set validator', () => {
      expect(factory.validateIdentity).to.equal(validateIdentityMock);
    });
  });

  describe('#create', () => {
    it('should create Identity from asset lock transaction, output index, proof and public keys', () => {
      const publicKeys = identity
        .getPublicKeys()
        .map((identityPublicKey) => ({
          ...identityPublicKey.toObject(),
          key: new PublicKey(identityPublicKey.getData()),
          readonly: true,
        }));

      const result = factory.create(
        instantAssetLockProof,
        publicKeys,
      );

      expect(result).to.be.an.instanceOf(Identity);
      expect(result.toObject()).to.deep.equal(identity.toObject());
    });
  });

  describe('#createFromObject', () => {
    it('should skip validation if options is set', () => {
      factory.createFromObject({}, { skipValidation: true });

      expect(validateIdentityMock).to.have.not.been.called();
    });

    it('should throw an error if validation have failed', () => {
      const errors = [new SomeConsensusError('error')];

      validateIdentityMock.returns(new ValidationResult(errors));

      try {
        factory.createFromObject(identity.toObject());

        expect.fail('error was not thrown');
      } catch (e) {
        expect(e).to.be.an.instanceOf(InvalidIdentityError);
        expect(e.getErrors()).to.have.deep.members(errors);
        expect(e.getRawIdentity()).to.deep.equal(identity.toObject());
      }
    });

    it('should create an identity if validation passed', () => {
      validateIdentityMock.returns(new ValidationResult());

      const result = factory.createFromObject(identity.toObject());

      expect(result).to.be.an.instanceOf(Identity);
      expect(result.toObject()).to.deep.equal(identity.toObject());
    });
  });

  describe('#createFromBuffer', () => {
    let serializedIdentity;
    let rawIdentity;

    beforeEach(function beforeEach() {
      this.sinonSandbox.stub(factory, 'createFromObject');

      serializedIdentity = identity.toBuffer();
      rawIdentity = identity.toObject();
    });

    afterEach(() => {
      factory.createFromObject.restore();
    });

    it('should return new Identity from serialized one', () => {
      decodeProtocolEntityMock.returns([rawIdentity.protocolVersion, rawIdentity]);

      factory.createFromObject.returns(identity);

      const result = factory.createFromBuffer(serializedIdentity);

      expect(result).to.equal(identity);

      expect(factory.createFromObject).to.have.been.calledOnceWith(rawIdentity);

      expect(decodeProtocolEntityMock).to.have.been.calledOnceWithExactly(
        serializedIdentity,
      );
    });

    it('should throw InvalidIdentityError if the decoding fails with consensus error', () => {
      const parsingError = new SerializedObjectParsingError(
        serializedIdentity,
        new Error(),
      );

      decodeProtocolEntityMock.throws(parsingError);

      try {
        factory.createFromBuffer(serializedIdentity);

        expect.fail('should throw InvalidIdentityError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(InvalidIdentityError);

        const [innerError] = e.getErrors();
        expect(innerError).to.equal(parsingError);
      }
    });

    it('should throw an error if decoding fails with any other error', () => {
      const parsingError = new Error('Something failed during parsing');

      decodeProtocolEntityMock.throws(parsingError);

      try {
        factory.createFromBuffer(serializedIdentity);

        expect.fail('should throw an error');
      } catch (e) {
        expect(e).to.equal(parsingError);
      }
    });
  });

  describe('#createInstantAssetLockProof', () => {
    it('should create instant asset lock proof from InstantLock', () => {
      const instantLock = instantAssetLockProof.getInstantLock();
      const assetLockTransaction = instantAssetLockProof.getTransaction();
      const outputIndex = instantAssetLockProof.getOutputIndex();

      const result = factory.createInstantAssetLockProof(
        instantLock,
        assetLockTransaction,
        outputIndex,
      );

      expect(result).to.be.instanceOf(InstantAssetLockProof);
      expect(result.getInstantLock()).to.deep.equal(instantLock);
    });
  });

  describe('#createIdentityCreateTransition', () => {
    it('should create IdentityCreateTransition from Identity model', () => {
      const stateTransition = factory.createIdentityCreateTransition(identity);

      expect(stateTransition).to.be.instanceOf(IdentityCreateTransition);
      expect(stateTransition.getPublicKeys()).to.deep.equal(identity.getPublicKeys());
      expect(stateTransition.getAssetLockProof().toObject())
        .to.deep.equal(instantAssetLockProof.toObject());
    });
  });

  describe('createChainAssetLockProof', () => {
    it('should create IdentityCreateTransition from Identity model', () => {
      identity = getIdentityFixture();
      identity.id = chainAssetLockProof.createIdentifier();
      identity.setAssetLockProof(chainAssetLockProof);
      identity.setBalance(0);

      const stateTransition = factory.createIdentityCreateTransition(identity);

      expect(stateTransition).to.be.instanceOf(IdentityCreateTransition);
      expect(stateTransition.getPublicKeys()).deep.to.equal(identity.getPublicKeys());
      expect(stateTransition.getAssetLockProof().toObject())
        .to.deep.equal(chainAssetLockProof.toObject());
    });
  });

  describe('#createIdentityTopUpTransition', () => {
    it('should create IdentityTopUpTransition from identity id and outpoint', () => {
      const stateTransition = factory
        .createIdentityTopUpTransition(
          identity.getId(),
          instantAssetLockProof,
        );

      expect(stateTransition).to.be.instanceOf(IdentityTopUpTransition);
      expect(stateTransition.getIdentityId()).to.deep.equal(identity.getId());
      expect(stateTransition.getAssetLockProof().toObject())
        .to.deep.equal(instantAssetLockProof.toObject());
    });
  });

  describe('createIdentityUpdateTransition', () => {
    it('should create IdentityUpdateTransition', () => {
      const revision = 1;
      const disablePublicKeys = [identity.getPublicKeyById(0)];
      const addPublicKeys = [new IdentityPublicKey({
        id: 0,
        type: IdentityPublicKey.TYPES.ECDSA_SECP256K1,
        data: Buffer.from('AuryIuMtRrl/VviQuyLD1l4nmxi9ogPzC9LT7tdpo0di', 'base64'),
        purpose: IdentityPublicKey.PURPOSES.AUTHENTICATION,
        securityLevel: IdentityPublicKey.SECURITY_LEVELS.MASTER,
        readOnly: false,
      })];

      const stateTransition = factory
        .createIdentityUpdateTransition(
          identity,
          {
            add: addPublicKeys,
            disable: disablePublicKeys,
          },
        );

      expect(stateTransition).to.be.instanceOf(IdentityUpdateTransition);
      expect(stateTransition.getIdentityId()).to.deep.equal(identity.getId());
      expect(stateTransition.getRevision()).to.deep.equal(revision);
      expect(stateTransition.getPublicKeysToAdd()).to.deep.equal(addPublicKeys);
      expect(stateTransition.getPublicKeyIdsToDisable()).to.deep.equal([0]);
      expect(stateTransition.getPublicKeysDisabledAt()).to.deep.equal(new Date());
    });
  });
});
