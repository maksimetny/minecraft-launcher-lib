
import * as nock from 'nock'
import { Authenticator, IAuthResponse, IAuthException } from './auth'

describe('Authenticator', () => {

    const clientToken = Authenticator.newToken()
    // const authenticator = new Authenticator(clientToken)

    const enum API {
        base = 'http://localhost:25560/authserver',
        _validate = '/validate',
        _invalidate = '/invalidate',
        _refresh = '/refresh',
        _authenticate = '/authenticate',
        _signout = '/signout'
    }

    describe('#newToken', () => {

        it('should drop new token', () => {
            const token = Authenticator.newToken()
            expect((token)).toBeTruthy()
        })

    })

    describe('#authenticate', () => {

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
                accessToken: 'abc'
            })

            const auth = (await Authenticator.authenticate(username, password, clientToken, false, API.base + API._authenticate)).data
            expect((auth)).toBeTruthy()
            expect((auth).accessToken).toBeTruthy()
            expect((auth).clientToken).toEqual(clientToken)
        })

    })

    describe('#validate', () => {

        it('should be able to valid access token with response 204', async () => {
            nock(API.base).post(API._validate, {
                clientToken,
                accessToken: 'abc'
            }).reply(204)

            expect(await Authenticator.validate('abc', clientToken, API.base + API._validate)).toBeTruthy()
        })

        it('should return `false` when validate an invalid access token with response 400', async () => {
            nock(API.base).post(API._validate, {
                clientToken,
                accessToken: 'abc'
            }).reply(400)

            expect(await Authenticator.validate('abc', clientToken, API.base + API._validate)).toBeFalsy()
        })

    })

    describe('#default', () => {

        it('should drop offline auth response', () => {
            const username = 'dragonhay', _auth = Authenticator.default(username)

            expect(_auth.selectedProfile.name).toEqual(username)
            expect(_auth.selectedProfile.id).toBeTruthy()
            expect(_auth.accessToken).toBeTruthy()
            expect(_auth.clientToken).toBeTruthy()
        })

    })

})
