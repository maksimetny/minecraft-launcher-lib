
import { Artifact, IArtifact } from '../../artifact';

export interface IVersionAssetIndexArtifact extends IArtifact {

    /**
     * This like assets prop in version attrs.
     **/
    id: string;

    totalSize: number;

}

export class VersionAssetIndexArtifact extends Artifact implements IVersionAssetIndexArtifact {

    static from(child: Partial<IVersionAssetIndexArtifact>, parent?: Partial<IVersionAssetIndexArtifact>): VersionAssetIndexArtifact {
        if (!parent) {
            if (child instanceof VersionAssetIndexArtifact) return child;
            parent = {};
        }

        const {
            id = parent.id,
            totalSize = parent.totalSize,
        } = child;

        if (!id) throw new Error('missing version asset index id');
        if (!totalSize) throw new Error('missing version asset index total size');

        const {
            path,
            url,
            size,
            sha1,
        } = Artifact.from(child, parent);

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
