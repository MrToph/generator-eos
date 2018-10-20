const { eos } = require(`../config`)
const { getErrorDetail } = require(`../utils`)

async function action() {
    try {
        const now = Date.now() // memo needs to be unique
        await eos.transfer(`test3`, process.env.CONTRACT_ACCOUNT, `2.0000 EOS`, now, {
            authorization: `test3`,
        })
        console.log(`SUCCESS`)
    } catch (error) {
        console.error(`${getErrorDetail(error)}`)
    }
}

action()
