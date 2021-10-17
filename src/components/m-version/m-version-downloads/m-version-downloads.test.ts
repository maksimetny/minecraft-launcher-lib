
import { MVersionDownloads, IMVersionDownloads } from './m-version-downloads';

describe('MVersionDownloads', () => {

    describe('#from', () => {

        it('should be able to resolve normal version downloads', () => {
            const versionDownloads: IMVersionDownloads = {
                client: {
                    sha1: '8c325a0c5bd674dd747d6ebaa4c791fd363ad8a9',
                    size: 25191691,
                    url: 'https://launcher.mojang.com/v1/objects/8c325a0c5bd674dd747d6ebaa4c791fd363ad8a9/client.jar',
                },
                server: {
                    sha1: '3dc3d84a581f14691199cf6831b71ed1296a9fdf',
                    size: 35958734,
                    url: 'https://launcher.mojang.com/v1/objects/3dc3d84a581f14691199cf6831b71ed1296a9fdf/server.jar',
                },
            };

            versionDownloads.client.path = '1.14.4.jar'; // override local jar path on launching

            const { client, server } = MVersionDownloads.from(versionDownloads);

            expect(client.path).toBe('1.14.4.jar');
            expect(client.sha1).toBe(versionDownloads.client.sha1);
            expect(client.url).toBe(versionDownloads.client.url);
            expect(client.size).toBe(versionDownloads.client.size);

            expect(server.path).toBe('server.jar');
            expect(server.sha1).toBe(versionDownloads.server.sha1);
            expect(server.url).toBe(versionDownloads.server.url);
            expect(server.size).toBe(versionDownloads.server.size);
        });

    });

});
