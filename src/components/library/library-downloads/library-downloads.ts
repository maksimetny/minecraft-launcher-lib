
import { Artifact, IArtifact } from '../../artifact';
import { Library, ILibrary } from '../library';

export interface ILibraryDownloads {
    artifact: Partial<IArtifact>;
    classifiers: {
        [classifier: string]: Partial<IArtifact>;
    };
}

export class LibraryDownloads implements ILibraryDownloads {

    static from(
        libraryDownloads: Partial<ILibraryDownloads>,
        parentLibrary?: Pick<Partial<ILibrary>, 'name' | 'natives'>,
    ): LibraryDownloads {
        if (!parentLibrary) {
            if (libraryDownloads instanceof LibraryDownloads) return libraryDownloads;
            parentLibrary = {};
        }

        const {
            natives = {},
            name,
        } = parentLibrary;

        if (!name) throw new Error('missing parent library name');

        const {
            artifact = {},
            classifiers = {},
        } = libraryDownloads;

        Object
            .entries(natives)
            .map(([os, classifier]) => {
                if (typeof classifier !== 'string') throw new Error('library native artifact classifier is not string');
                return {
                    classifier,
                    os,
                    include: classifier in classifiers,
                };
            })
            .filter(({ include }) => !include)
            .forEach(({ classifier }) => {
                const nameWithNativeClassifier = Library.concatNameWithClassifier(name, classifier);
                classifiers[classifier] = Artifact.from(nameWithNativeClassifier);
            }); // construct missing natives // TODO format classifier

        return new LibraryDownloads(
            Artifact.from(artifact, name),
            Object.fromEntries(
                Object
                    .entries(classifiers)
                    .map(([classifier, artifact]) => {
                        const nameWithClassifier = Library.concatNameWithClassifier(name, classifier);
                        return [classifier, Artifact.from(artifact, nameWithClassifier)];
                    }),
            ),
        );
    }

    private _artifact: Artifact;
    private _classifiers: Record<string, Artifact> = {};

    constructor(artifact: Partial<IArtifact>, classifiers: ILibraryDownloads['classifiers'] = {}) {
        Object.entries(classifiers).forEach(([classifier, artifact]) => this.setArtifactByClassifier(classifier, artifact));
        this._artifact = Artifact.from(artifact);
    }

    get artifact(): Artifact { return this._artifact; }

    set artifact(artifact: Artifact) {
        this._artifact = Artifact.from(artifact);
    }

    get classifiers(): Record<string, Artifact> {
        return this._classifiers;
    }

    // TODO set classifiers(classifiers: Record<string, Artifact>) { }

    setArtifactByClassifier(classifier: string, artifact: Partial<IArtifact>): Artifact {
        return this._classifiers[classifier] = Artifact.from(artifact);
    }

    getArtifactByClassifier(classifier: string): Artifact {
        return this._classifiers[classifier];
    }

    toJSON(): ILibraryDownloads {
        const {
            artifact,
            classifiers,
        } = this;
        return {
            artifact,
            classifiers,
        };
    }

}
