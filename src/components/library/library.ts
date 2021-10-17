
import { Rule, IRule } from '../rule';
import { Platform, OS, IPlatform } from '../platform';
import { Argument } from '../argument';
import { LibraryDownloads, ILibraryDownloads } from './library-downloads';

export interface ILibrary {

    downloads: Partial<ILibraryDownloads>;

    /**
     * The library id, it like `<group>:<artifact>:<version>` or `<group>:<artifact>:<version>@<ext>`.
     */
    name: string;

    /**
     * The native atrifacts classifiers, e.g. `'linux': 'natives-linux'`.
     */
    natives: Partial<Record<OS, string>>;

    extract: {
        exclude?: string[];
    };

    rules: Partial<IRule>[];

}

export class Library implements ILibrary {

    static from(lib: string | Partial<ILibrary>): Library {
        if (typeof lib !== 'string') {
            if (lib instanceof Library) return lib;
        } else {
            return new Library(lib);
        }

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
            LibraryDownloads.from(downloads, { name, natives }),
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
    private _extract: Required<ILibrary['extract']>;
    private _rules: Rule[];

    constructor(
        public name: string,
        downloads: Partial<ILibraryDownloads> = {},
        public natives: ILibrary['natives'] = {},
        extract: ILibrary['extract'] = {},
        rules: Partial<IRule>[] = [],
    ) {
        this._downloads = LibraryDownloads.from(downloads, { name, natives });

        const { exclude = ['META-INF/'] } = extract;
        this._extract = { exclude };

        this._rules = rules.map(rule => Rule.from(rule));
    }

    get downloads(): LibraryDownloads { return this._downloads; }

    set downloads(downloads: LibraryDownloads) {
        this._downloads = LibraryDownloads.from(downloads, this);
    }

    get extract(): Required<ILibrary['extract']> { return this._extract; }

    get rules(): Rule[] { return this._rules; }

    set rules(rules: Rule[]) {
        this._rules = rules.map(rule => Rule.from(rule));
    }

    /**
     * Checks if this library is applicable to the current platform and features.
     *
     * @param platform The current platform.
     * @param features The current featutes.
     *
     * @returns Is library applicable?
     */
    isApplicable(
        platform: Partial<IPlatform> = {},
        features: Record<string, unknown> = {},
    ): boolean {
        return !this.rules.map(rule => rule.isAllowable(platform, features)).includes(false);
    }

    hasNative = (os: OS = Platform.current.name): boolean => os in this.natives;

    /**
     * Gets its native classifier or throws an error, if library has not native classifier.
     *
     * @param platform The current platform.
     * @param format Format the result?
     *
     * @returns The native classifier.
     */
    getNativeClassifier(platform: Partial<IPlatform> = {}, format = false): string {
        const { name, arch } = Platform.from(platform);
        const classifier = this.natives[name];

        if (!classifier) throw new Error('library has not native classifier');

        return format ? Argument.format(
            classifier,
            new Map([
                ['arch', arch.match(/\d\d/g)?.shift() ?? '32'],
            ]),
        ) : classifier;
    }

    toString(): string { return this.name; }

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
