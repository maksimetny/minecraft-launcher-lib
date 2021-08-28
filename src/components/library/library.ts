
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

        if (!name) throw new Error('missing library name');

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

    private _downloads: LibraryDownloads;
    private _extract: Required<LibraryExtract>;
    private _rules: Rule[];

    constructor(
        public name: string,
        downloads: Partial<ILibraryDownloads> = {},
        public natives: LibraryNatives = {},
        extract: LibraryExtract = {},
        rules: Partial<IRule>[] = [],
    ) {
        this._downloads = LibraryDownloads.from(downloads, name, natives);

        const { exclude = ['META-INF/'] } = extract;
        this._extract = { exclude };

        this._rules = rules.map(rule => Rule.from(rule));
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

    set rules(rules: Rule[]) {
        this._rules = rules.map(rule => Rule.from(rule));
    }

    isApplicable(
        platform: Partial<IPlatform> = {},
        features: Record<string, boolean> = {},
    ): boolean {
        return !this.rules.map(rule => rule.isAllowable(platform, features)).includes(false);
    }

    getNativeClassifier(platform: Partial<IPlatform> = {}, format = false): string {
        const {
            name,
            arch,
        } = Platform.from(platform);

        const classifier = this.natives[name];
        if (!classifier) throw new Error('library has not native classifier');

        const fields: Map<string, string> = new Map();
        if (format) fields.set('arch', arch.match(/\d\d/g)?.shift() ?? '32');

        return Argument.format(classifier, fields);
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
