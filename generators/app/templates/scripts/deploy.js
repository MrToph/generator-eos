const fs = require(`fs`)
const path = require(`path`)
const { sendTransaction, getErrorDetail } = require(`../utils`)

async function deploy() {
    const { CONTRACT_ACCOUNT } = process.env
    const contractDir = `./contract`
    const wasm = fs.readFileSync(path.join(contractDir, `<%= moduleNameCamelCased %>.wasm`))
    const abi = fs.readFileSync(path.join(contractDir, `<%= moduleNameCamelCased %>.abi`))

    try {
        await sendTransaction({
            account: `eosio`,
            name: `setcode`,
            data: {
                account: CONTRACT_ACCOUNT,
                vmtype: 0,
                vmversion: 0,
                code: wasm.toString(`hex`),
            },
        })
        console.log(`Contract updated`)
    } catch (error) {
        console.log(`setcode failed:`, getErrorDetail(error))
    }

    try {
        await sendTransaction({
            account: `eosio`,
            name: `setabi`,
            data: {
                account: CONTRACT_ACCOUNT,
                abi: abi.toString(`hex`),
            },
        })
    } catch (error) {
        console.log(`setabi failed:`, getErrorDetail(error))
    }
}

deploy()
