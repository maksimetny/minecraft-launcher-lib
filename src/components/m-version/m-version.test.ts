
import { MVersion } from './m-version';
import { join } from 'path';
import { readJson } from '../util';

describe('MVersion', () => {

    it('should resolve normal version', async () => {
        const versionJsonPath = join('mock', 'versions', '1.14.4', '1.14.4.json');
        const version = MVersion.from(await readJson(versionJsonPath));

        expect(version.assetIndex.path).toBe('1.14.json');

        expect(version.downloads.client.path).toBe('client.jar');
        expect(version.downloads.server.path).toBe('server.jar');
    });

    it('should consolidate versions', async () => {
        const versionId = '1.14.4-forge-28.0.47';
        const parentVersionId = '1.14.4';

        const version = MVersion.from(
            await readJson(join('mock', 'versions', versionId, versionId + '.json')),
            await readJson(join('mock', 'versions', parentVersionId, parentVersionId + '.json')),
        );

        const [forge] = version.libs;
        expect(forge.downloads.artifact.sha1).toBe('e022de358b2f5259e0fc3661f8a0946e6bb88996');

        expect(version.id).toBe(versionId);
        expect(version.mainClass).toBe('cpw.mods.modlauncher.Launcher');
    });

});
