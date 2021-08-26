
import { Artifact, IArtifact } from '../../artifact';

export interface IVersionAssetIndexArtifact extends IArtifact {

    /**
     * This like assets prop in version attrs.
     **/
    id: string;

    totalSize: number;

}

export class VersionAssetIndexArtifact extends Artifact implements IVersionAssetIndexArtifact {

    static from(
        assetIndex: Partial<IVersionAssetIndexArtifact>,
        parentAssetIndex: Partial<IVersionAssetIndexArtifact> = {},
    ): VersionAssetIndexArtifact {
        if (assetIndex instanceof VersionAssetIndexArtifact) return assetIndex;

        const {
            id: _id,
            totalSize: _totalSize,
        } = parentAssetIndex;
        const {
            id = _id,
            totalSize = _totalSize,
        } = assetIndex;

        if (typeof id !== 'string') throw new Error('version asset index id is not string');
        if (typeof totalSize !== 'number') throw new Error('version asset index id is not number');

        const {
            path,
            url,
            size,
            sha1,
        } = Artifact.from(assetIndex, parentAssetIndex);

        return new VersionAssetIndexArtifact(
            id,
            totalSize,
            path,
            url,
            size,
            sha1,
        );
    }

    constructor(
        public id: string,
        public totalSize: number,
        path: string,
        url: string,
        size?: number,
        sha1?: string,
    ) {
        super(path, url, size, sha1);
    }

}
