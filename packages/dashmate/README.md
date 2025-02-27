# Dashmate

[![Build Status](https://github.com/dashpay/platform/actions/workflows/release.yml/badge.svg)](https://github.com/dashpay/platform/actions/workflows/release.yml)
[![Release Date](https://img.shields.io/github/release-date/dashpay/platform)](https://github.com/dashpay/platform/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

Distribution package for Dash Masternode installation

## Table of Contents

- [Install](#install)
- [Update](#update)
- [Usage](#usage)
  - [Command line interface](#cli)
  - [Setup node](#setup-node)
  - [Configure node](#configure-node)
  - [Start node](#start-node)
  - [Stop node](#stop-node)
  - [Restart node](#restart-node)
  - [Show node status](#show-node-status)
  - [Reset node data](#reset-node-data)
  - [Full node](#full-node)
  - [Node groups](#node-groups)
  - [Development](#development)
  - [Docker Compose](#docker-compose)
- [Contributing](#contributing)
- [License](#license)

## Install

### Dependencies

* [Docker](https://docs.docker.com/engine/installation/) (v20.10+)
* [Node.js](https://nodejs.org/en/download/) (v16.0+, NPM v8.0+)

For Linux installations you may optionally wish to follow the [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/) to manage Docker as a non-root user, otherwise you will have to run CLI and Docker commands with `sudo`.

### Distribution package

Use NPM to install dashmate globally in your system:
```bash
$ npm install -g dashmate
```

## Update

The `update` command is used to quickly get the latest patches for dashmate components. It is necessary to restart the node after the update is complete.
```bash
$ dashmate stop
$ npm update -g dashmate
$ dashmate update
$ dashmate start
```

In some cases, you must also additionally reset platform data:

* Upgrade contains non-compatible changes (f.e. switching between v22/v23)
* Command ``dashmate setup`` finished with errors or interrupted in the process
* Platform layer has been wiped in the network

```bash
$ dashmate stop
$ npm update -g dashmate
$ dashmate reset --platform-only --hard
$ dashmate update
$ dashmate setup
$ dashmate start
```

Before applying an upgrade, local network should be stopped and reset via ``dashmate reset --hard``. 

## Usage

The package contains a CLI, Docker Compose and configuration files.

### CLI

The CLI can be used to perform routine tasks. Invoke the CLI with `dashmate` if linked during installation, or with `node bin/dashmate` if not linked. To list available commands, either run `dashmate` with no parameters or execute `dashmate help`. To list the help on any command just execute the command, followed by the `--help` option.

### Setup node

The `setup` command is used to quickly configure common node configurations. Arguments may be provided as options, otherwise they will be queried interactively with sensible values suggested.

```
USAGE
  $ dashmate setup [PRESET] [NODE-TYPE]

ARGUMENTS
  PRESET     (testnet|local) Node configuration preset
  NODE-TYPE  (masternode|fullnode) Node type

OPTIONS
  -d, --[no-]debug-logs                                    enable debug logs
  -i, --external-ip=external-ip                            external ip
  -k, --operator-bls-private-key=operator-bls-private-key  operator bls private key
  -m, --miner-interval=miner-interval                      interval between blocks
  -p, --funding-private-key=funding-private-key            private key with more than 1000 dash for funding collateral
  -v, --verbose                                            use verbose mode for output
  --node-count=node-count                                  number of nodes to setup
```

Supported presets:
 * `testnet` - a masternode or full node for testnet
 * `local` - a node group to run a local dash network with the specified number of masternodes. To operate a group of nodes, use the [group commands](#node-groups)

To setup a testnet masternode:
```bash
$ dashmate setup testnet masternode
```

#### Masternode registration

If a funding private key is provided with the `--funding-private-key` option, the tool will automatically register your node on the network as a masternode. This functionality is only available when using the `testnet` preset.

### Configure node

The `config` command is used to manage your node configuration before starting the node. Several system configurations are provided as a starting point:

 - base - basic config for use as template
 - local - template for local node configs
 - testnet - testnet node configuration

You can modify and use the system configs directly, or create your own. You can base your own configs on one of the system configs using the `dashmate config create CONFIG [FROM]` command. You must set a default config with `dashmate config default CONFIG` or specify a config with the `--config=<config>` option when running commands. The `base` config is initially set as default.

```
USAGE
  $ dashmate config

OPTIONS
  -v, --verbose    use verbose mode for output
  --config=config  configuration name to use

DESCRIPTION
  Display configuration options for default config

COMMANDS
  config create   Create config
  config default  Manage default config
  config envs     Export config to envs
  config get      Get config option
  config list     List available configs
  config remove   Remove config
  config set      Set config option
```

### Start node

The `start` command is used to start a node with the default or specified config.

```
USAGE
  $ dashmate start

OPTIONS
  -v, --verbose             use verbose mode for output
  -w, --wait-for-readiness  wait for nodes to be ready
  --config=config           configuration name to use
```

To start a masternode:
```bash
$ dashmate start
```

### Stop node

The `stop` command is used to stop a running node.

```
USAGE
  $ dashmate stop

OPTIONS
  -f, --force      force stop nodes (skips running check)
  -v, --verbose    use verbose mode for output
  --config=config  configuration name to use
```

To stop a node:
```bash
$ dashmate stop
```

### Restart node

The `restart` command is used to restart a node with the default or specified config.

```
USAGE
  $ dashmate restart

OPTIONS
  -v, --verbose    use verbose mode for output
  --config=config  configuration name to use
```

### Show node status

The `status` command outputs status information relating to either the host, masternode or services.

```
USAGE
  $ dashmate status

OPTIONS
  -v, --verbose    use verbose mode for output
  --config=config  configuration name to use

COMMANDS
  status core        Show core status details
  status host        Show host status details
  status masternode  Show masternode status details
  status platform    Show platform status details
  status services    Show service status details
```

To show the host status:
```bash
$ dashmate status host
```

### Reset node data

The `reset` command removes all data corresponding to the specified config and allows you to start a node from scratch.

```
USAGE
  $ dashmate reset [--config <value>] [-v] [-h] [-f] [-p]

FLAGS
  -f, --force          skip running services check
  -h, --hard           reset config as well as data
  -p, --platform-only  reset platform data only
  -v, --verbose        use verbose mode for output
  --config=<value>     configuration name to use

DESCRIPTION
  Reset node data
```

To reset a node:
```bash
$ dashmate reset
```

### Reindex dashcore chain data

The `reindex` command rebuilds the block chain index using the downloaded block data.

It modifies the configuration, runs the core container in `reindex=1` mode, waits until it fully resynces, and returns it to the normal mode.

The process is interactive (shows progress) and can be interrupted any time, but you cannot start your configuration until the resync is fully complete.

The `reindex` command works for regular and local configurations.

```
Reindex Core

USAGE
  $ dashmate core reindex [-v] [--config <value>]

FLAGS
  -v, --verbose     use verbose mode for output
  --config=<value>  configuration name to use

DESCRIPTION
  Reindex Core

  Reindex Core data
```

With the hard reset mode enabled, the corresponding config will be reset as well. To proceed, running the node [setup](#setup-node) is required.

To reset a node:
```bash
$ dashmate reset
=======
#### Hard reset

``dashmate reset --hard``

With the hard reset mode enabled, the corresponding config will be reset as well. This command cleans up all related containers and volumes. To proceed, running the node [setup](#setup-node) is required.

#### Manual reset

Manual reset is used when local setup corrupts and hard reset does not fix it. This could happen, when dashmate configuration becomes incompatible after a major upgrade, making you unable to execute any commands.

```bash
docker stop $(docker ps -q)
docker system prune
docker volume prune
rm -rf ~/.dashmate/
```

### Full node

It is also possible to start a full node instead of a masternode. Modify the config setting as follows:

```bash
dashmate config set core.masternode.enable false
```

### Node groups

CLI allows to [setup](#setup-node) and operate multiple nodes. Only the `local` preset is supported at the moment.

#### Default group

The [setup](#setup-node) command set corresponding group as default. To output the current default group or set another one as default use `group:default` command.

```
USAGE
  $ dashmate group default [GROUP]

ARGUMENTS
  GROUP  group name

OPTIONS
  -v, --verbose  use verbose mode for output
```

#### List group configs

The `group list` command outputs a list of group configs.

```
USAGE
  $ dashmate group list

OPTIONS
  -v, --verbose  use verbose mode for output
  --group=group  group name to use
```

#### Start group nodes

The `group start` command is used to start a group of nodes belonging to the default group or a specified group.

```
USAGE
  $ dashmate group start

OPTIONS
  -v, --verbose             use verbose mode for output
  -w, --wait-for-readiness  wait for nodes to be ready
  --group=group             group name to use
```

#### Stop group nodes

The `group stop` command is used to stop group nodes belonging to the default group or a specified group.

```
USAGE
  $ dashmate group stop

OPTIONS
  -f, --force    force stop nodes (skips running check)
  -v, --verbose  use verbose mode for output
  --group=group  group name to use
```

#### Restart group nodes

The `group restart` command is used to restart group nodes belonging to the default group or a specified group.

```
USAGE
  $ dashmate group restart

OPTIONS
  -v, --verbose  use verbose mode for output
  --group=group  group name to use
```

#### Show group status

The `group status` command outputs group status information.

```
USAGE
  $ dashmate group status

OPTIONS
  -v, --verbose  use verbose mode for output
  --group=group  group name to use
```

#### Reset group nodes

The `group reset` command removes all data corresponding to the specified group and allows you to start group nodes from scratch.

```
USAGE
  $ dashmate group reset [--group <value>] [-v] [--hard] [-f] [-p]

FLAGS
  -f, --force          reset even running node
  -p, --platform-only  reset platform data only
  -v, --verbose        use verbose mode for output
  --group=<value>      group name to use
  --hard               reset config as well as data

DESCRIPTION
  Reset group nodes
```

With the hard reset mode enabled, corresponding configs will be reset as well. To proceed, running the node [setup](#setup-node) is required.

#### Create config group

To group nodes together, set a group name to `group` option in corresponding configs.

Create a group of two testnet nodes:
```bash
# create a new config using `testnet` config as template
dashmate config create testnet_2 testnet

# combine configs into the group
dashmate config set --config=testnet group testnet
dashmate config set --config=testnet_2 group testnet

# set the group as default
dashmate group default testnet
```

To start the group of nodes, ports and other required options need to be updated.

### Development

To start a local dash network, the `setup` command with the `local` preset can be used to generate configs, mine some dash, register masternodes and populate the nodes with the data required for local development.

To allow developers quickly test changes to DAPI and Drive, a local path for this repository may be specified via the `platform.sourcePath` config options. A Docker image will be built from the provided path and then used by Dashmate.

### Docker Compose

If you want to use Docker Compose directly, you will need to pass a configuration as a dotenv file. You can output a config to a dotenv file for Docker Compose as follows:

```bash
$ dashmate config envs --config=testnet --output-file .env.testnet
```

Then specify the created dotenv file as an option for the `docker compose` command:

```bash
$ docker compose --env-file=.env.testnet up -d
```
## Troubleshooting

#### [FAILED] Node is not running
One of your nodes is not running, you may retry with the --force option:

`dashmate stop --force` to stop single node (fullnode / masternode)

`dashmate group:stop --force` to stop group of nodes (local)

#### Running services detected. Please ensure all services are stopped for this config before starting
Some nodes are still running and preventing dashmate to make a proper start, that might be left after unsuccessful close. Try to stop them forcibly with --force option before trying to start

`dashmate stop --force` to stop single node (fullnode / masternode)

`dashmate group:stop --force` to stop group of nodes (local)

#### externalIp option is not set in base config
This may happen when you switch between multiple major versions, so your config became incompatible. In this case, do a manual reset and run setup again

#### TypeError Plugin: dashmate: Cannot read properties of undefined (reading 'dash')
This could happen if you have other .yarnrc and node_modules in your upper directories. Check your home directory for any .yarnrc and node_modules, wipe them all and try again




## Contributing

Feel free to dive in! [Open an issue](https://github.com/dashpay/platform/issues/new/choose) or submit PRs.

## License

[MIT](LICENSE) &copy; Dash Core Group, Inc.
