
import { Artifact, IArtifact } from '../../artifact';

export interface IVersionDownloads {
    client: IArtifact;
    // server: IArtifact
}

export class VersionDownloads implements IVersionDownloads {

    static from(_downloads: Partial<IVersionDownloads>): VersionDownloads {
        if (_downloads instanceof VersionDownloads) {
            return _downloads;
        }

        const {
            client: _client,
            // server: _server,
        } = _downloads;

        if (!_client) throw new Error('missing client artifact');
        // if (!_server) throw new Error('missing server artifact');

        const client = Artifact.from(_client, { path: 'client.jar' });
        // const server = Artifact.from(_server, { path: 'server.jar' });

        return new VersionDownloads(client);
    }

    constructor(private _client: Artifact) { }

    get client(): Artifact { return this._client; }

    set client(_client: Artifact) { this._client = _client; }

}
