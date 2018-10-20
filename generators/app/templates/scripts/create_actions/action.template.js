const { eos } = require(`../config`)
const { getErrorDetail } = require(`../utils`)

const { CONTRACT_ACCOUNT } = process.env

async function action() {
    try {
        const contract = await eos.contract(CONTRACT_ACCOUNT)
        await contract.<%- actionName %>(
            <%- payload %>,
            { authorization: `test1` },
        )
        console.log(`SUCCESS`)
    } catch (error) {
        console.error(`${getErrorDetail(error)}`)
    }
}

action()
