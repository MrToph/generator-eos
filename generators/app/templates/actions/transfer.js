const { eos } = require(`../config`)
const { getErrorDetail } = require(`../utils`)

async function action() {
    try {
        const now = Date.now() // memo needs to be unique
        await eos.transfer({
            from: `test2`,
            to: process.env.CONTRACT_ACCOUNT,
            quantity: `1.0000 EOS`,
            memo: `${now}`, // must be unique
        })
        console.log(`SUCCESS`)
    } catch (error) {
        console.error(`${getErrorDetail(error)}`)
    }
}

action()
