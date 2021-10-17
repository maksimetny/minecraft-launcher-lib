
import { OfflineAuthenticator } from '../components/authenticator';

function bootstrap() {
    const offlineAuthenticator = new OfflineAuthenticator('steve');
    const offlineAuth = offlineAuthenticator.getAuth();
    console.log(offlineAuth);
}

bootstrap();
