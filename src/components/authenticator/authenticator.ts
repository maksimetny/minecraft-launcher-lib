
import * as uuid from 'uuid';

export interface IAuth {
    accessToken: string;
    uuid: string;
    user: {
        name: string;
        type: string;
        properties: {
            [prop: number]: { name: string; value: string };
        };
    };
}

export interface IAuthProvider {
    getAuth(): IAuth;
}

export abstract class Authenticator {

    /**
     * Generate a random token (by UUID v4).
     * @returns a random token.
     */
    static generateToken = (replaceSep = true, sep = ''): string => replaceSep ? uuid.v4().replace(/-/g, sep) : uuid.v4();

}

