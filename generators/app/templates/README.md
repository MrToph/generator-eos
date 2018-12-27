# Setup

## eosio-cpp

Requires `eosio-cpp (>=v1.3.2)` to be installed from the [eosio.cdt](https://github.com/EOSIO/eosio.cdt) package to compile the smart contract.
Also needs `cmake` for compiling the smart contract.

(MacOS: `brew install cmake`)

## Local Blockchain setup

Run any EOS version with nodeos on docker:

```
docker run --name eosio \
    --publish 7777:7777 \
    --publish 127.0.0.1:5555:5555 \
    --volume /Users/cmichel/Code/contracts:/Users/cmichel/Code/contracts \
    --detach \
    eosio/eos:latest \
    /bin/bash -c \
    "keosd --http-server-address=0.0.0.0:5555 & exec nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --plugin eosio::http_plugin -d /mnt/dev/data --config-dir /mnt/dev/config --http-server-address=0.0.0.0:7777 --access-control-allow-origin=* --contracts-console --verbose-http-errors --http-validate-host=false --filter-on='*'"
```

Change the EOS http endpoint in `.development.env` to ` --http-server-address=` from the docker command (here `http://127.0.0.1:7777`).
Then deploy the `eosio.token` contract and do other initialization steps by running:

```bash
npm run init_blockchain # deploys eosio.token
npm run init # creates accounts
```

## Compiling

This template uses `cmake` to build the contract. Run the following commands once to setup the process:

```
cd build
cmake ../contract
```

Now you can run `npm run compile` which will run `make` to create the `.wasm` and `.abi` in `/build`.

## Deployment

Fill out the missing private key in `.testnet.env`, `.production.env`.

There's a `npm run init` script that _sets up your contract account_ and test accounts by creating them and transferring them enough EOS + RAM/NET/CPU.

> This should only be run on your local network to create accounts!

To deploy to the network specified in `.<environment>.env`, run:

```
NODE_ENV=testnet npm run deploy
```


## Testing the smart contract

You can run the following scripts to **automatically create scripts for your actions** defined in the ABI file.

```
npm run create_actions
```

You can then invoke these scripts to push actions to your deployed smart contract **without using cleos**:

```
npm run action -- <actionName>
```

Inspecting the contract's table can be done by:

```
npm run table -- <tableName>
```
