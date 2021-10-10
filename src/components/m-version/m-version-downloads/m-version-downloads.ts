
import { Artifact, IArtifact } from '../../artifact';

export interface IMVersionDownloads {
    client: Partial<IArtifact>;
    server: Partial<IArtifact>;
}

export class MVersionDownloads implements IMVersionDownloads {

    static from(child: Partial<IMVersionDownloads>, parent?: Partial<IMVersionDownloads>): MVersionDownloads {
        if (!parent) {
            if (child instanceof MVersionDownloads) return child;
            parent = {};
        }

        const {
            client: parentClient = {},
            server: parentServer = {},
        } = parent;
        const {
            client = parentClient,
            server = parentServer,
        } = child;

        return new MVersionDownloads(
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

    set client(client: Artifact) { this._client = Artifact.from(client); }

    get server(): Artifact { return this._server; }

    set server(server: Artifact) { this._server = Artifact.from(server); }

    toJSON(): IMVersionDownloads {
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
