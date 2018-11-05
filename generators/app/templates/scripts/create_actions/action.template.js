const { sendTransaction, getErrorDetail } = require(`../utils`)

const { CONTRACT_ACCOUNT } = process.env

async function action() {
    try {
        await sendTransaction({
            name: `<%- actionName %>`,
            actor: CONTRACT_ACCOUNT,
            data: <%- payload %>,
        })
        console.log(`SUCCESS`)
    } catch (error) {
        console.error(`${getErrorDetail(error)}`)
    }
}

action()
