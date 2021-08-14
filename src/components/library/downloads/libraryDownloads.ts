
import { urls } from '../../../constants/urls';

import {
    Artifact,
    IArtifact,
} from '../../artifact';

export interface ILibraryDownloads {
    artifact: IArtifact;
    classifiers: Record<string, IArtifact>;
}

import {
    LibraryNatives,
} from '../library';

export class LibraryDownloads implements ILibraryDownloads {

    static from(
        _downloads: Partial<ILibraryDownloads>,
        _name: string, _natives: LibraryNatives,
        _repoURL: string = urls.DEFAULT_LIBS_REPO,
    ): LibraryDownloads {
        if (_downloads instanceof LibraryDownloads) return _downloads;

        const defaultArtifact = Artifact.fromString(_name, _repoURL);
        const {
            artifact: _artifact = defaultArtifact,
            classifiers: _classifiers = { /* [classifier]: artifact */ },
        } = _downloads;
        const downloads = new LibraryDownloads(Artifact.from(_artifact, defaultArtifact));

        function getNameWithClassifier(classifier: string) {
            const namePartsSep = ':';
            const nameParts = _name.split(namePartsSep);
            const ver = nameParts[nameParts.length - 1];

            nameParts.pop();
            nameParts.push('jar', classifier, ver);
            return nameParts.join(namePartsSep);
        }

        Object.entries(_natives)
            .map(([
                // os,
                classifier,
            ]) => {
                return {
                    classifier,
                    // os,
                    include: classifier in _classifiers,
                };
            })
            .filter(({ include }) => !include)
            .forEach(({
                classifier,
            }) => {
                // TODO format classifier
                const nameWithClassifier = getNameWithClassifier(classifier);

                downloads.setArtifactByClassifier(classifier, Artifact.fromString(nameWithClassifier, _repoURL));
            });

        Object.entries(_classifiers)
            .forEach(([
                classifier,
                artifact,
            ]) => {
                const nameWithClassifier = getNameWithClassifier(classifier);
                const _artifact = Artifact.from(artifact, Artifact.fromString(nameWithClassifier, _repoURL));

                downloads.setArtifactByClassifier(classifier, _artifact);
            });

        return downloads;
    }

    constructor(
        private _artifact: Artifact,
        private _classifiers: Record<string, Artifact> = { /* [classifier]: artifact */ },
    ) { }

    get artifact(): Artifact { return this._artifact; }

    set artifact(_artifact: Artifact) { this._artifact = _artifact; }

    get classifiers(): Record<string, Artifact> {
        return this._classifiers;
    }

    setArtifactByClassifier(classifier: string, artifact: IArtifact): Artifact {
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
