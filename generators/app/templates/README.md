# Setup

Fill out the missing private key in `.testnet.env`, `.production.env`.

There's a `npm run init` script that sets up test accounts and your contract account and fills them with enough EOS.

> This should only be run on your local network to create accounts!

To deploy to the network specified in `.<environment>.env`, run:

```
NODE_ENV=testnet npm run deploy
```


## Testing the smart contract
Run a local node:

```
nodeos -c dev.ini --data-dir ~/.local/share/eosio/nodeos/data-dev --contracts-console --verbose-http-errors
```

You can run the following scripts to push actions to your deployed smart contract without using cleos:

```
npm run @transfer
```

Inspecting the contract's table can be done by:

```
npm run dump_tables
```