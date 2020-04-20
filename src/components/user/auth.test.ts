
import * as nock from 'nock'
import { Authenticator, IAuthResponse } from './auth'

describe('Authenticator', () => {

    const clientToken = Authenticator.newToken()
    // const authenticator = new Authenticator(clientToken)
    let auth: IAuthResponse

    const enum API {
        base = 'http://localhost:25560/authserver',
        _validate = '/validate',
        _invalidate = '/invalidate',
        _refresh = '/refresh',
        _authenticate = '/authenticate',
        _signout = '/signout'
    }

    it('should drop new token', () => {
        const token = Authenticator.newToken()
        expect((token)).toBeTruthy()
    })

    it('should login with username and password', async () => {
        const username = 'dragonhay@example.com'
        const password = '12345'

        nock(API.base).post(API._authenticate, {
            clientToken,
            requestUser: false,
            username,
            password,
            agent: { name: 'minecraft', version: 1 }
        }).reply(200, {
            clientToken,
            accessToken: Authenticator.newToken()
        })

        auth = await Authenticator.login(username, password, clientToken, false, API.base + API._authenticate)
        expect(auth).toBeTruthy()
        expect(auth.clientToken).toEqual(clientToken)
    })

    it('should drop offline auth response', () => {
        const username = 'dragonhay', _auth = Authenticator.default(username)

        expect(_auth.selectedProfile.name).toEqual(username)
        expect(_auth.selectedProfile.id).toBeTruthy()
        expect(_auth.accessToken).toBeTruthy()
        expect(_auth.clientToken).toBeTruthy()
    })

})
