
import { EventEmitter } from 'events';
import { Artifact, IArtifact } from '../artifact';

export abstract class ArtifactTask extends EventEmitter {

    protected artifact: Artifact;

    constructor(
        artifact: Partial<IArtifact>,
    ) {
        super();
        this.artifact = Artifact.from(artifact);
    }

}
