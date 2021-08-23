
import { MOJANG } from '../../constants';
import { join } from 'path';

export interface IArtifact {
    path: string;
    url: string;
    size: number;
    sha1?: string;
    // TODO hash type
}

export class Artifact implements IArtifact {

    static from(artifact: string | Partial<IArtifact>, def: Partial<IArtifact> = {}): Artifact {
        if (artifact instanceof Artifact) return artifact;
        else if (typeof artifact !== 'object') return Artifact.fromId(artifact);

        const {
            path = def.path,
            url = def.url,
            size = def.size,
            sha1 = def.sha1,
        } = artifact;

        if (typeof path !== 'string') throw new Error('artifact path is not string');
        if (typeof url !== 'string') throw new Error('artifact url is not string');

        return new Artifact(path, url, size, sha1);
    }

    /**
     * @param id should look like `<group>:<artifact>:<version>`, e.g. `com.mojang:patchy:1.1`.
     * @param defaultExtension should look like `jar`, `tar.xz` or other.
     * @param repoURL e.g. `https://libraries.mojang.com`.
     */
    static fromId(id: string, defaultExtension: string = 'jar', repoURL: string = MOJANG.LIBS_REPO): Artifact {
        const parts = id.split(':');

        if (parts.length < 3) throw new Error('passed string is not include a valid artifact id');

        const [group, artifact, unsplittedVersion] = parts;
        const [version, versionExtension = defaultExtension] = unsplittedVersion.split('@');
        const paths: string[] = [...group.split('.'), artifact, version];

        if (parts.length > 3) {
            const [unsplittedClassifier] = parts.slice(3);
            const [classifier, classifierExtension = defaultExtension] = unsplittedClassifier.split('@');
            paths.push(`${artifact}-${version}-${classifier}.${classifierExtension}`);
        } else {
            paths.push(`${artifact}-${version}.${versionExtension}`);
        }

        return new Artifact(join(...paths), repoURL + '/' + paths.join('/'));
    }

    private _path: string;
    private _url: string;
    private _size: number;

    constructor(
        path: string,
        url: string,
        size: number = 0,
        public sha1?: string,
    ) {
        this._path = path;
        this._url = url;
        this._size = size;
    }

    get size(): number { return this._size; }

    set size(_size: number) { this._size = _size; }

    get url(): string {
        return this._url;
    }

    set url(_url: string) {
        this._url = _url;
    }

    get path(): string { return this._path; }

    set path(_path: string) { this._path = _path; }

    /**
     * @returns a artifact id, it should look like `<group>:<artifact>:<version>@<extension>`, e.g. `com.mojang:patchy:1.1@jar`.
     */
    toString(defaultExtension = 'jar'): string {
        const parts: string[] = this.path.split('/').reverse();
        const target = parts.shift();
        const version = parts.shift();
        const artifact = parts.shift();
        const group = parts.reverse().join('.');

        if (!target || !version || !artifact) throw new Error('artifact path parse error');

        const targetSep = '-';
        const splittedTarget = target.split(targetSep);

        const i = splittedTarget.indexOf(version);
        const ext = i >= 1 ? splittedTarget.slice(i + 1).join(targetSep) : (splittedTarget.reverse().shift() || defaultExtension).replace(version, '');

        const extSep = '.';
        const idSep = ':';

        if (ext.startsWith(extSep)) return [group, artifact, version].join(idSep) + '@' + ext.replace(extSep, '');

        const splittedExtension = ext.split(extSep);
        const classifier = splittedExtension.shift();
        return [group, artifact, version, classifier].join(idSep) + '@' + splittedExtension.join(extSep);
    }

    toJSON(): IArtifact {
        const {
            path,
            url,
            size,
            sha1,
        } = this;
        return {
            path,
            url,
            size,
            sha1,
        };
    }

}
