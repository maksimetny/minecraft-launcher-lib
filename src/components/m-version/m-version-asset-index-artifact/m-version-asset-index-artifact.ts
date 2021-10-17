
import { Artifact, IArtifact } from '../../artifact';

export interface IMVersionAssetIndexArtifact extends IArtifact {

    /**
     * This like assets prop in version attrs.
     **/
    id: string;

    totalSize: number;

}

export class MVersionAssetIndexArtifact extends Artifact implements IMVersionAssetIndexArtifact {

    static from(child: Partial<IMVersionAssetIndexArtifact>, parent?: Partial<IMVersionAssetIndexArtifact>): MVersionAssetIndexArtifact {
        if (!parent) {
            if (child instanceof MVersionAssetIndexArtifact) return child;
            parent = {};
        }

        const {
            id = parent.id,
            totalSize = parent.totalSize,
        } = child;

        if (!id) throw new Error('missing minecraft version asset index id');
        if (!totalSize) throw new Error('missing minecraft version asset index total size');

        const {
            path,
            url,
            size,
            sha1,
        } = Artifact.from(child, parent);

        return new MVersionAssetIndexArtifact(
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
