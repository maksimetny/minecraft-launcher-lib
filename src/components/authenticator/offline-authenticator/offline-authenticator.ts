
import { Authenticator, IAuth, IAuthProvider } from '../authenticator';

export class OfflineAuthenticator extends Authenticator implements IAuthProvider {

    constructor(
        public username: string,
        public uuid: string = Authenticator.generateToken(),
    ) {
        super();
    }

    getAuth(): IAuth {
        return {
            accessToken: Authenticator.generateToken(),
            user: {
                name: this.username,
                uuid: this.uuid,
                type: 'legacy',
                properties: {},
            },
        };
    }

}
