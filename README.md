# generator-eos

Yeoman generator template for EOS blockchain smart contracts wrapped in Node.js utilities.

This generator makes it easy to compile, deploy, trigger actions of your smart contract from simple `npm run <script>` commands without using `cleos` and `keosd`.

## Usage

```
npx -p yo -p generator-eos -c 'yo eos'
```

## Development

To test this generator while developing run `yo` with a local path to the generator

```
yo ./generator-eos/generators/app/
```