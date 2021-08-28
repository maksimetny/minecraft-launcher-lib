
import { Artifact, IArtifact } from '../../artifact';

export interface IVersionDownloads {
    client: Partial<IArtifact>;
    server: Partial<IArtifact>;
}

export class VersionDownloads implements IVersionDownloads {

    static from(versionDownloads: Partial<IVersionDownloads>, parent: Partial<IVersionDownloads> = {}): VersionDownloads {
        if (versionDownloads instanceof VersionDownloads) return versionDownloads;

        const {
            client: parentClient = {},
            server: parentServer = {},
        } = parent;
        const {
            client = parentClient,
            server = parentServer,
        } = versionDownloads;

        return new VersionDownloads(
            Artifact.from(client, { path: 'client.jar' }),
            Artifact.from(server, { path: 'server.jar' }),
        );
    }

    private _client: Artifact;
    private _server: Artifact;

    constructor(
        client: Partial<IArtifact>,
        server: Partial<IArtifact>,
    ) {
        this._client = Artifact.from(client);
        this._server = Artifact.from(server);
    }

    get client(): Artifact { return this._client; }

    set client(_client: Artifact) { this._client = Artifact.from(_client); }

    get server(): Artifact { return this._server; }

    set server(_server: Artifact) { this._server = Artifact.from(_server); }

    toJSON(): IVersionDownloads {
        const {
            client,
            server,
        } = this;
        return {
            client,
            server,
        };
    }

}
