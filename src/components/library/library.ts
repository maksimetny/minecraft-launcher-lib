
import { urls } from '../../constants/urls';

import {
    Rule,
    IRule,
} from '../rule';

import {
    currentPlatform,
    IPlatform,
    OS,
} from '../platform';

import { LibraryDownloads, ILibraryDownloads } from './downloads';

export type LibraryNatives = Record<string, string>; // TODO key => OS

export type LibraryExtract = {
    exclude: string[];
};

export interface ILibrary {

    downloads: ILibraryDownloads;

    /**
     * A maven name for library,
     * in form of `group:artifact:version`.
     */
    name: string;

    natives: LibraryNatives;

    rules: IRule[];

    extract: LibraryExtract;

}

import {
    Argument,
} from '../argument';

export class Library implements ILibrary {

    static from(_lib: Partial<ILibrary>, _repo: string = urls.DEFAULT_LIBS_REPO): Library {
        if (_lib instanceof Library) return _lib;

        const {
            name: _name,
            downloads: _downloads = { /* artifact, classifiers */ },
            extract: _extract = {
                exclude: [
                    'META-INF/',
                ],
            },
            rules: _rules = [],
            natives: _natives = { /* `${os}`: `natives-${os}` or `natives-${os}-${arch}` */ },
        } = _lib;

        if (typeof _name !== 'string') throw new Error('library name not string');

        return new Library(
            _name,
            LibraryDownloads.from(_downloads, _name, _natives, _repo),
            _natives,
            _extract,
            _rules.map(_rule => Rule.from(_rule)),
        );
    }

    constructor(
        private _name: string,
        private _downloads: LibraryDownloads,
        private _natives: LibraryNatives,
        private _extract: LibraryExtract,
        private _rules: Rule[],
    ) { }

    get name(): string {
        return this._name;
    }

    get downloads(): LibraryDownloads {
        return this._downloads;
    }

    get natives(): LibraryNatives {
        return this._natives;
    }

    get extract(): LibraryExtract {
        return this._extract;
    }

    get rules(): Rule[] {
        return this._rules;
    }

    isApplicable(platform: Partial<IPlatform> = { /* platform */ }, features: Record<string, boolean> = { /* features */ }): boolean {
        return !this.rules.map(rule => {
            return rule.isAllowable(platform, features);
        }).includes(false);
    }

    hasNative(os: OS = currentPlatform.name): boolean {
        return os in this.natives;
    }

    getNativeClassifier(platform: Partial<IPlatform> = { /* platform */ }): string {
        const {
            name = currentPlatform.name,
            arch = currentPlatform.arch,
        } = platform;

        const format = (_arch: string) => {
            const classifier = this.natives[name];
            const fields = new Map([
                ['arch', _arch],
            ]);

            return Argument.format(classifier, fields);
        };

        switch (arch) {
            case 'x64': {
                return format('64');
            }
            default: {
                return format('32');
            } // x32 or unknown
        }
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
