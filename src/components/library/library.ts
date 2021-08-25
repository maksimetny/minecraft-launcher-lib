
import { MOJANG } from '../../constants/urls';
import { Rule, IRule } from '../rule';
import { Platform, OS, IPlatform } from '../platform';
import { Argument } from '../argument';
import { LibraryDownloads, ILibraryDownloads } from './library-downloads';

export type LibraryNatives = Partial<Record<OS, string>>;

export type LibraryExtract = {
    exclude?: string[];
};

export interface ILibrary {

    downloads: Partial<ILibraryDownloads>;

    /**
     * A library id, it like `<group>:<artifact>:<version>` or
     * `<group>:<artifact>:<version>@<ext>`.
     */
    name: string;

    /**
     * A native atrifacts classifiers, e.g.
     * `'linux': 'natives-linux'`.
     */
    natives: LibraryNatives;

    rules: IRule[];

    extract: LibraryExtract;

}

export class Library implements ILibrary {

    // TODO library from id
    static from(lib: Partial<ILibrary>, repoURL: string = MOJANG.LIBS_REPO): Library {
        if (lib instanceof Library) return lib;

        const {
            name,
            downloads = {},
            extract,
            rules,
            natives,
        } = lib;

        if (typeof name !== 'string') throw new Error('library name is not string');

        return new Library(
            name,
            LibraryDownloads.from(downloads, name, natives, repoURL),
            natives,
            extract,
            rules,
        );
    }

    static concatNameWithClassifier(name: string, classifier: string): string {
        const s = ':';
        const parts = name.split(s);
        const [group, artifact, unsplittedVersion] = parts;
        const [version, versionExtension] = unsplittedVersion.split('@');

        return [
            group,
            artifact,
            version,
            versionExtension ? classifier + '@' + versionExtension : classifier,
        ].join(s);
    }

    private _name: string;
    private _downloads: LibraryDownloads;
    private _extract: Required<LibraryExtract>;
    private _rules: Rule[];

    constructor(
        name: string,
        downloads: Partial<LibraryDownloads> = {},
        readonly natives: LibraryNatives = {},
        extract: LibraryExtract = {},
        rules: Partial<IRule>[] = [],
    ) {
        this._name = name;

        this._downloads = LibraryDownloads.from(downloads, name, natives);

        const { exclude = ['META-INF/'] } = extract;
        this._extract = { exclude };

        this._rules = rules.map(rule => Rule.from(rule));
    }

    get name(): string {
        return this._name;
    }

    get downloads(): LibraryDownloads {
        return this._downloads;
    }

    get extract(): Required<LibraryExtract> {
        return this._extract;
    }

    get rules(): Rule[] {
        return this._rules;
    }

    isApplicable(
        platform: Partial<IPlatform> = {},
        features: Record<string, boolean> = {},
    ): boolean {
        return !this.rules.map(rule => rule.isAllowable(platform, features)).includes(false);
    }

    hasNativeClassifier(os: OS = Platform.current.name): boolean { return os in this.natives; }

    createNativeClassifier(platform: Partial<IPlatform> = {}, format = false): string {
        const {
            name,
            arch,
        } = Platform.from(platform);
        if (!this.hasNativeClassifier(name)) throw new Error('library has not native classifier');

        const fields: Map<string, string> = new Map();
        if (format) fields.set('arch', arch.match(/\d\d/g)?.shift() ?? '32');

        return Argument.format(this.natives[name] as string, fields);
    }

    toString(): string {
        return this.name;
    }

    toJSON(): ILibrary {
        const {
            name,
            downloads,
            natives,
            extract,
            rules,
        } = this;
        return {
            name,
            downloads,
            natives,
            extract,
            rules,
        };
    }

}
