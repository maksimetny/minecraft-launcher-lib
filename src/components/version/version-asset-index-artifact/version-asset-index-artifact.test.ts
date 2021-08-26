
import { VersionAssetIndexArtifact, IVersionAssetIndexArtifact } from './version-asset-index-artifact';

describe('VersionAssetIndexArtifact', () => {

    it('should resolve normal asset index artifact', () => {
        const assetIndex: IVersionAssetIndexArtifact = {
            url: 'https://launchermeta.mojang.com/v1/packages/d6c94fad4f7a03a8e46083c023926515fc0e551e/1.14.json',
            id: '1.14',
            path: '1.14.json',
            sha1: 'd6c94fad4f7a03a8e46083c023926515fc0e551e',
            size: 226753,
            totalSize: 209234283,
        };
        const {
            url,
            id,
            path,
            sha1,
            size,
            totalSize,
        } = VersionAssetIndexArtifact.from(assetIndex);

        expect(url).toBe(assetIndex.url);
        expect(id).toBe(assetIndex.id);
        expect(path).toBe(assetIndex.path);
        expect(sha1).toBe(assetIndex.sha1);
        expect(size).toBe(assetIndex.size);
        expect(totalSize).toBe(assetIndex.totalSize);
    });

});
