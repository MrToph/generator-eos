function getErrorDetail(error) {
    try {
        const json = typeof error === `string` ? JSON.parse(error) : JSON.parse(error.message)
        return json.error.details[0].message
    } catch (err) {
        return error.message
    }
}

module.exports = {
    getErrorDetail,
}
