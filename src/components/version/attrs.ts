
import { Artifact, IArtifact } from './artifact'
import { Argument, IArgument } from './arg'

export interface IVersionDownloads {
    client: IArtifact
    server: IArtifact
}

export class VersionDownloads implements IVersionDownloads {

    constructor(readonly client: Artifact, readonly server: Artifact) { }

}

type VersionArgument = string | /* or */ Required<IArgument>

export interface IVersionArguments { game: VersionArgument[], jvm: VersionArgument[] }

export class VersionArguments implements IVersionArguments {

    constructor(readonly game: Argument[] = [], readonly jvm: Argument[] = []) { }

}

import { Library, ILibrary } from './lib'

export interface IVersion {
    id: string
    downloads: IVersionDownloads
    arguments: IVersionArguments
    libraries: ILibrary[]
}

export class Version { }
