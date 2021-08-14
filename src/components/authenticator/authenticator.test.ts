
import * as nock from 'nock';
import {
    Authenticator,
    IAuthEndpoints,
} from './authenticator';

const endpoints: IAuthEndpoints = {
    base: 'http://localhost:8080/authserver',
    _validate: '/validate',
    _invalidate: '/invalidate',
    _refresh: '/refresh',
    _authenticate: '/authenticate',
    _signout: '/signout',
};

describe('Authenticator', () => {

    const authenticator = new Authenticator(Authenticator.newToken(), endpoints);

    describe('#newToken', () => {

        it('should drop new token', () => {
            const token = Authenticator.newToken();
            expect((token)).toBeTruthy();
        });

    });

    describe('#authenticate', () => {

        it('should login with username and password', async () => {
            const username = 'dragonhay@example.com';
            const password = '12345';

            nock(endpoints.base).post(endpoints._authenticate, {
                clientToken: authenticator.clientToken,
                requestUser: false,
                username,
                password,
                agent: { name: 'minecraft', version: 1 },
            }).reply(200, {
                clientToken: authenticator.clientToken,
                accessToken: 'abc',
            });

            const { data }= await authenticator.authenticate(username, password, false);

            expect((data)).toBeTruthy();
            expect((data).accessToken).toBeTruthy();
            expect((data).clientToken).toEqual(authenticator.clientToken);
        });

    });

    describe('#validate', () => {

        it('should be able to valid access token with response 204', async () => {
            nock(endpoints.base).post(endpoints._validate, {
                clientToken: authenticator.clientToken,
                accessToken: 'abc',
            }).reply(204);

            expect(await authenticator.validate('abc')).toBeTruthy();
        });

        it('should return `false` when validate an invalid access token with response 400', async () => {
            nock(endpoints.base).post(endpoints._validate, {
                clientToken: authenticator.clientToken,
                accessToken: 'abc',
            }).reply(400);

            expect(await authenticator.validate('abc')).toBeFalsy();
        });

    });

    describe('#default', () => {

        it('should drop offline auth response', () => {
            const username = 'dragonhay';
            const auth = Authenticator.default(username);

            expect(auth.selectedProfile.name).toEqual(username);
            expect(auth.selectedProfile.id).toBeTruthy();
            expect(auth.accessToken).toBeTruthy();
            expect(auth.clientToken).toBeTruthy();
        });

    });

});
