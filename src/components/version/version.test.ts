
import { Version } from './version';
import { join } from 'path';
import { readJson } from '../../util';

describe('Version', () => {

    it('should resolve normal version', async () => {
        const versionJsonPath = join('mock', 'versions', '1.14.4', '1.14.4.json');
        const version = Version.from(await readJson(versionJsonPath));

        expect(version.assetIndex.path).toBe('1.14.json');

        expect(version.downloads.client.path).toBe('client.jar');
        expect(version.downloads.server.path).toBe('server.jar');
    });

    it('should consolidate versions', async () => {
        const versionId = '1.14.4-forge-28.0.47';
        const parentVersionId = '1.14.4';
        /* const version = */ Version.from(
            await readJson(join('mock', 'versions', versionId, versionId + '.json')),
            await readJson(join('mock', 'versions', parentVersionId, parentVersionId + '.json')),
        );

        // console.log(version);
    });

});
