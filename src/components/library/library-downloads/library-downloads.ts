
import { MOJANG } from '../../../constants/urls';
import { Library, LibraryNatives } from '../library';
import { Artifact, IArtifact } from '../../artifact';

export interface ILibraryDownloads {
    artifact: Partial<IArtifact>;
    classifiers: {
        [classifier: string]: Partial<IArtifact>;
    };
}

export class LibraryDownloads implements ILibraryDownloads {

    static from(
        libraryDownloads: Partial<ILibraryDownloads>,
        libraryId: string,
        libraryNatives: LibraryNatives = {},
        repoURL: string = MOJANG.LIBS_REPO,
    ): LibraryDownloads {
        if (libraryDownloads instanceof LibraryDownloads) return libraryDownloads;

        const {
            artifact = {},
            classifiers = {},
        } = libraryDownloads;

        Object
            .entries(libraryNatives)
            .map(([
                os,
                classifier,
            ]) => {
                if (typeof classifier !== 'string') throw new Error('library native artifact classifier is not string');
                return {
                    classifier,
                    os,
                    include: classifier in classifiers,
                };
            })
            .filter(({ include }) => !include)
            .forEach(({
                classifier,
            }) => {
                // TODO format classifier
                const libraryIdWithNativeClassifier = Library.concatNameWithClassifier(libraryId, classifier);
                classifiers[classifier] = Artifact.fromId(libraryIdWithNativeClassifier, repoURL);
            });

        return new LibraryDownloads(
            Artifact.from(artifact, Artifact.fromId(libraryId, repoURL)),
            Object.fromEntries(
                Object
                    .entries(classifiers)
                    .map(([
                        classifier,
                        artifact,
                    ]) => {
                        const libIdWithNativeClassifier = Library.concatNameWithClassifier(libraryId, classifier);
                        const defaultArtifact = Artifact.fromId(libIdWithNativeClassifier, repoURL);
                        return [classifier, Artifact.from(artifact, defaultArtifact)];
                    }),
            ),
        );
    }

    private _classifiers: Record<string, Artifact>;

    constructor(
        readonly artifact: Artifact,
        classifiers: {
            [classifier: string]: Partial<IArtifact>;
        } = {},
    ) {
        this._classifiers = Object.fromEntries(
            Object
                .entries(classifiers)
                .map(([classifier, artifact]) => ([classifier, Artifact.from(artifact)])),
        );
    }

    get classifiers(): Record<string, Artifact> {
        return this._classifiers;
    }

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
