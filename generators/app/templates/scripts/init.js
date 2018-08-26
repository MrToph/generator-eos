const fs = require(`fs`)
const path = require(`path`)
const { eos, keys } = require(`../config`)
const { getErrorDetail } = require(`../utils`)

const { CONTRACT_ACCOUNT } = process.env

async function createAccount(name, publicKey) {
    try {
        await eos.getAccount(name)
        console.log(`"${name}" already exists: ${publicKey}`)
        // no error => account already exists
        return
    } catch (e) {
        // error => account does not exist yet
    }
    console.log(`Creating "${name}" ${publicKey} ...`)
    await eos.transaction(tr => {
        tr.newaccount({
            creator: `eosio`,
            name,
            owner: publicKey,
            active: publicKey,
            deposit: `10000.0000 SYS`,
        })

        tr.buyrambytes({
            payer: `eosio`,
            receiver: name,
            bytes: 1024 * 1024,
        })

        tr.delegatebw({
            from: `eosio`,
            receiver: name,
            stake_net_quantity: `10.0000 SYS`,
            stake_cpu_quantity: `10.0000 SYS`,
            transfer: 0,
        })
    })

    await eos.transfer({
        from: `eosio`,
        to: name,
        // SYS is configured as core symbol for creating accounts etc.
        // use EOS here to pay for contract
        quantity: `1000000.0000 EOS`,
        memo: `Happy spending`,
    })
    console.log(`Done.`)
}

async function deploy() {
    const contractDir = `./contract`
    const wasm = fs.readFileSync(path.join(contractDir, `<%= moduleNameCamelCased %>.wasm`))
    const abi = fs.readFileSync(path.join(contractDir, `<%= moduleNameCamelCased %>.abi`))

    // Publish contract to the blockchain
    const codePromise = eos.setcode(CONTRACT_ACCOUNT, 0, 0, wasm)
    const abiPromise = eos.setabi(CONTRACT_ACCOUNT, JSON.parse(abi))

    await Promise.all([codePromise, abiPromise])

    console.log(`Deployment successful.`)
    console.log(`Updating auth with eosio.code ...`)
    const oldPublicKey = keys[CONTRACT_ACCOUNT][1]
    const auth = {
        threshold: 1,
        keys: [{ key: oldPublicKey, weight: 1 }],
        accounts: [
            { permission: { actor: CONTRACT_ACCOUNT, permission: `eosio.code` }, weight: 1 },
        ],
    }
    eos.updateauth({
        account: CONTRACT_ACCOUNT,
        permission: `active`,
        parent: `owner`,
        auth,
    })
    console.log(`Done.`)
}

async function init() {
    const accountNames = Object.keys(keys)
    for (const accountName of accountNames) {
        const [, publicKey] = keys[accountName]
        try {
            // eslint-disable-next-line no-await-in-loop
            await createAccount(accountName, publicKey)
        } catch (error) {
            console.error(`Cannot create account ${accountName} "${getErrorDetail(error)}"`)
            console.error(typeof error !== `string` ? JSON.stringify(error) : error)
        }
    }

    try {
        await deploy()
    } catch (error) {
        console.error(getErrorDetail(error))
        console.error(typeof error !== `string` ? JSON.stringify(error) : error)
    }
}

init()
