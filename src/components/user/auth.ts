
export interface IAuthResponse {
    accessToken: string              // hexadecimal
    clientToken: string              // identical to one received
    availableProfiles?: IProfile[]
    selectedProfile: IProfile        // only present if agent field was received
    user?: IUser                     // only present if requestUser was true in request payload
}

export interface IProfile {
    id: string                       // hexadecimal (uuid without dashes)
    name: string                     // nickname
    userId?: string                  // hex string
    createdAt?: number
    legacyProfile?: boolean
    suspended?: boolean
    paid?: boolean
    migrated?: boolean
    legacy?: boolean                 // in practice, this field only appears in response if true (default to false)
}

interface IUser {
    id: string                       // hexadecimal
    email: string                    // hashed(?) value for unmigrated accounts
    username: string                 // regular name for unmigrated accounts, email for migrated ones
    registerIp: string               // IP address with last digit censored
    migratedFrom: string
    migratedAt: number
    registeredAt: number             // may be a few minutes earlier than createdAt for profile
    passwordChangedAt: number
    dateOfBirth: number
    suspended: boolean
    blocked: boolean
    secured: boolean
    migrated: boolean                // seems to be false even when migratedAt and migratedFrom are present..
    emailVerified: boolean
    legacyUser: boolean
    verifiedByParent: boolean
    properties: {
        [index: number]: {
            name: string
            value: string
        }
    }
}

export interface IAuthException {
    error: string
    errorMessage: string
}

import { post, RequestPromise } from 'request-promise'
import { urls } from '../../constants'
import { v4 as generateUUID } from 'uuid'

export class Authenticator {

    /**
     * Random generate a new token by uuid v4.
     * @returns a new token.
     */
    static newToken = () => generateUUID().replace(/-/g, '')

    /**
     * Create an offline auth.
     * @param username The user's username.
     */
    static default(username: string) {
        const auth: IAuthResponse = {
            accessToken: Authenticator.newToken(),
            clientToken: Authenticator.newToken(),
            selectedProfile: { name: username, id: Authenticator.newToken() }
        }

        return auth
    }

    /**
     * Authenticate a user with their Mojang credentials.
     *
     * @param username The user's username, this is often an email.
     * @param password The user's password.
     * @param clientToken The launcher's clientToken.
     * @param requestUser Adds user object to the reponse (optional).
     * @param url of auth API (default: authserver.mojang.com/authenticate).
     *
     * @see http://wiki.vg/Authentication#Authenticate
     */
    static login(username: string, password: string, clientToken: string, requestUser = false, url = `${urls.DEFAULT_AUTH_URL}/authenticate`) {
        const requestObject = {
            json: true,
            body: {
                clientToken,
                requestUser,
                username,
                password,
                agent: { name: 'minecraft', version: 1 }
            }
        }

        return post(url, requestObject) as RequestPromise<IAuthResponse>
    }

    /**
     * Делает недействительными токен доступа, используя имя пользователя и пароль.
     *
     * @param username The user's username, this is often an email.
     * @param password The user's password.
     * @param url of auth API (default: authserver.mojang.com/signout).
     */
    static logout(username: string, password: string, url = `${urls.DEFAULT_AUTH_URL}/signout`) {
        const requestObject = { json: { username, password } }
        return post(url, requestObject)
    }

    /**
     * Validate an access token.
     * This should always be done before launching.
     * The client token should match the one used to create the access token.
     *
     * @param accessToken The access token.
     * @param clientToken The launcher's client token.
     * @param url of auth API (default: authserver.mojang.com/validate).
     *
     * @see http://wiki.vg/Authentication#Validate
     */
    static validate(accessToken: string, clientToken: string, url = `${urls.DEFAULT_AUTH_URL}/validate`) {
        const requestObject = { json: { accessToken, clientToken } }
        return post(url, requestObject)
    }

    /**
     * Invalidate an access token.
     * The client token must match the token used to create the provided access token.
     *
     * @param accessToken The access token.
     * @param clientToken The launcher's client token.
     * @param url of auth API (default: authserver.mojang.com/invalidate).
     *
     * @see http://wiki.vg/Authentication#Invalidate
     */
    static invalidate(accessToken: string, clientToken: string, url = `${urls.DEFAULT_AUTH_URL}/invalidate`) {
        const requestObject = { json: { accessToken, clientToken } }
        return post(url, requestObject)
    }

    /**
     * Refresh a user's authentication.
     * This should be used to keep a user logged in without asking them for their credentials again.
     * A new access token will be generated using a recent invalid access token.
     *
     * @param accessToken The old access token.
     * @param clientToken The launcher's client token.
     * @param requestUser Adds user object to reponse (optional).
     * @param url of auth API (default: authserver.mojang.com/refresh).
     *
     * @see http://wiki.vg/Authentication#Refresh
     */
    static refresh(accessToken: string, clientToken: string, requestUser = true, url = `${urls.DEFAULT_AUTH_URL}/refresh`) {
        const requestObject = { json: { accessToken, clientToken, requestUser } }
        return post(url, requestObject) as RequestPromise<IAuthResponse>
    }

}
