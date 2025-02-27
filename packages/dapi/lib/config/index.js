const OPTIONS = {
  LIVENET: 'LIVENET',
  API_JSON_RPC_PORT: 'API_JSON_RPC_PORT',
  API_GRPC_PORT: 'API_GRPC_PORT',
  TX_FILTER_STREAM_GRPC_PORT: 'TX_FILTER_STREAM_GRPC_PORT',
  DASHCORE_RPC_PROTOCOL: 'DASHCORE_RPC_PROTOCOL',
  DASHCORE_RPC_USER: 'DASHCORE_RPC_USER',
  DASHCORE_RPC_PASS: 'DASHCORE_RPC_PASS',
  DASHCORE_RPC_HOST: 'DASHCORE_RPC_HOST',
  DASHCORE_RPC_PORT: 'DASHCORE_RPC_PORT',
  DASHCORE_ZMQ_HOST: 'DASHCORE_ZMQ_HOST',
  DASHCORE_ZMQ_PORT: 'DASHCORE_ZMQ_PORT',
  DASHCORE_P2P_HOST: 'DASHCORE_P2P_HOST',
  DASHCORE_P2P_PORT: 'DASHCORE_P2P_PORT',
  DASHCORE_P2P_NETWORK: 'DASHCORE_P2P_NETWORK',
  DRIVE_RPC_HOST: 'DRIVE_RPC_HOST',
  DRIVE_RPC_PORT: 'DRIVE_RPC_PORT',
  BLOCK_HEADERS_CACHE_SIZE: 'BLOCK_HEADERS_CACHE_SIZE',
  NETWORK: 'NETWORK',
  BLOOM_FILTER_PERSISTENCE_TIMEOUT: 'BLOOM_FILTER_PERSISTENCE_TIMEOUT',
  TENDERMINT_RPC_HOST: 'TENDERMINT_RPC_HOST',
  TENDERMINT_RPC_PORT: 'TENDERMINT_RPC_PORT',
};

const DEFAULT_CONFIG = {};

DEFAULT_CONFIG[OPTIONS.LIVENET] = false;
DEFAULT_CONFIG[OPTIONS.API_JSON_RPC_PORT] = 2501;
DEFAULT_CONFIG[OPTIONS.API_GRPC_PORT] = 2500;
DEFAULT_CONFIG[OPTIONS.TX_FILTER_STREAM_GRPC_PORT] = 2510;
DEFAULT_CONFIG[OPTIONS.DASHCORE_RPC_PROTOCOL] = 'http';
DEFAULT_CONFIG[OPTIONS.DASHCORE_RPC_USER] = 'dashrpc';
DEFAULT_CONFIG[OPTIONS.DASHCORE_RPC_PASS] = 'password';
DEFAULT_CONFIG[OPTIONS.DASHCORE_RPC_HOST] = '127.0.0.1';
DEFAULT_CONFIG[OPTIONS.DASHCORE_RPC_PORT] = 30002;
DEFAULT_CONFIG[OPTIONS.DASHCORE_ZMQ_HOST] = '127.0.0.1';
DEFAULT_CONFIG[OPTIONS.DASHCORE_ZMQ_PORT] = 30003;
DEFAULT_CONFIG[OPTIONS.DASHCORE_P2P_HOST] = '127.0.0.1';
DEFAULT_CONFIG[OPTIONS.DASHCORE_P2P_PORT] = 30001;
DEFAULT_CONFIG[OPTIONS.DASHCORE_P2P_NETWORK] = 'testnet';
DEFAULT_CONFIG[OPTIONS.DRIVE_RPC_HOST] = '127.0.0.1';
DEFAULT_CONFIG[OPTIONS.DRIVE_RPC_PORT] = 6000;
DEFAULT_CONFIG[OPTIONS.BLOCK_HEADERS_CACHE_SIZE] = 500;
DEFAULT_CONFIG[OPTIONS.NETWORK] = 'testnet';
DEFAULT_CONFIG[OPTIONS.BLOOM_FILTER_PERSISTENCE_TIMEOUT] = 1000 * 60;

const envConfig = {};
Object
  .keys(OPTIONS)
  .forEach((optionName) => {
    if (process.env[optionName]) {
      envConfig[optionName] = process.env[optionName];
    }
  });

const config = { ...DEFAULT_CONFIG, ...envConfig };

module.exports = {
  livenet: config[OPTIONS.LIVENET] === 'true',
  rpcServer: {
    port: parseInt(config[OPTIONS.API_JSON_RPC_PORT], 10),
  },
  grpcServer: {
    port: parseInt(config[OPTIONS.API_GRPC_PORT], 10),
  },
  txFilterStream: {
    grpcServer: {
      port: parseInt(config[OPTIONS.TX_FILTER_STREAM_GRPC_PORT], 10),
    },
  },
  dashcore: {
    rpc: {
      protocol: config[OPTIONS.DASHCORE_RPC_PROTOCOL],
      user: config[OPTIONS.DASHCORE_RPC_USER],
      pass: config[OPTIONS.DASHCORE_RPC_PASS],
      host: config[OPTIONS.DASHCORE_RPC_HOST],
      port: parseInt(config[OPTIONS.DASHCORE_RPC_PORT], 10),
    },
    zmq: {
      host: config[OPTIONS.DASHCORE_ZMQ_HOST],
      port: parseInt(config[OPTIONS.DASHCORE_ZMQ_PORT], 10),
    },
    p2p: {
      host: config[OPTIONS.DASHCORE_P2P_HOST],
      port: parseInt(config[OPTIONS.DASHCORE_P2P_PORT], 10),
      network: config[OPTIONS.DASHCORE_P2P_NETWORK],
    },
  },
  network: config[OPTIONS.NETWORK].toLowerCase(),
  bloomFilterPersistenceTimeout: config[OPTIONS.BLOOM_FILTER_PERSISTENCE_TIMEOUT],
  tendermintCore: {
    host: config[OPTIONS.TENDERMINT_RPC_HOST],
    port: parseInt(config[OPTIONS.TENDERMINT_RPC_PORT], 10),
  },
  blockHeaders: {
    cache: {
      maxSize: Number(config[OPTIONS.BLOCK_HEADERS_CACHE_SIZE]),
      maxAge: 1000 * 60 * 60,
    },
  },
};
