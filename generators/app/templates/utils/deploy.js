const fs = require(`fs`)
const path = require(`path`)
const { Serialize } = require(`eosjs`)
const { api } = require(`../config`)
const { sendTransaction, getErrorDetail } = require(`./others`)

function getDeployableFilesFromDir(dir) {
    const dirCont = fs.readdirSync(dir)
    const wasmFileName = dirCont.find(filePath => filePath.match(/.*\.(wasm)$/gi))
    const abiFileName = dirCont.find(filePath => filePath.match(/.*\.(abi)$/gi))
    if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`)
    if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`)
    return {
        wasmPath: path.join(dir, wasmFileName),
        abiPath: path.join(dir, abiFileName),
    }
}

async function deployContract({ account, contractDir }) {
    const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir)
    const wasm = fs.readFileSync(wasmPath).toString(`hex`)

    try {
        await sendTransaction({
            account: `eosio`,
            name: `setcode`,
            actor: account,
            data: {
                account,
                vmtype: 0,
                vmversion: 0,
                code: wasm,
            },
        })
        console.log(`Contract updated ${wasmPath}`)
    } catch (error) {
        console.error(`setcode failed:`, getErrorDetail(error))
    }

    try {
        const buffer = new Serialize.SerialBuffer({
            textEncoder: api.textEncoder,
            textDecoder: api.textDecoder,
        })

        let abi = JSON.parse(fs.readFileSync(abiPath, `utf8`))
        const abiDefinition = api.abiTypes.get(`abi_def`)
        // need to make sure abi has every field in abiDefinition.fields
        // otherwise serialize throws
        abi = abiDefinition.fields.reduce(
            (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
            abi,
        )
        abiDefinition.serialize(buffer, abi)

        await sendTransaction({
            account: `eosio`,
            name: `setabi`,
            actor: account,
            data: {
                account,
                abi: Buffer.from(buffer.asUint8Array()).toString(`hex`),
            },
        })
        console.log(`ABI updated ${abiPath}`)
    } catch (error) {
        console.error(`setabi failed:`, getErrorDetail(error))
    }
}

module.exports = {
    deployContract,
}
