
import { Authenticator } from '../index'

async function validate(auth) {
    try {
        await Authenticator.validate(auth.accessToken, auth.clientToken)
        return true
    } catch (err) {
        errorHandle(err)
        return false
    }
}

async function invalidate(auth) {
    try {
        await Authenticator.invalidate(auth.accessToken, auth.clientToken)
        return true
    } catch (err) {
        errorHandle(err)
        return false
    }
}

function errorHandle(err) { console.error(err) }

async function main(username, password, clientToken) {
    const authFromMojang = (await Authenticator.authenticate(username, password, clientToken, true)).data
    // const auth = Authenticator.default(username)

    console.log(authFromMojang.selectedProfile, authFromMojang.user)
    console.log(await validate(authFromMojang), await invalidate(authFromMojang))
}

const env = require('dotenv')
env.config()
main(process.env.AUTH_USERNAME, process.env.AUTH_PASSWORD, process.env.AUTH_TOKEN).catch(err => {
    return errorHandle(err)
})
