
import {
    Argument,
    IArgument,
} from '../../argument'

export type VersionArgument = string | Partial<IArgument>

export interface IVersionArguments { game: VersionArgument[], jvm: VersionArgument[] }

export class VersionArguments implements IVersionArguments {

    static DEFAULT_JVM_ARGS: Argument[] = [
        new Argument([
            '-Dminecraft.launcher.brand=${launcher_name}',
        ]),
        new Argument([
            '-Dminecraft.launcher.version=${launcher_version}',
        ]),
        new Argument([
            '-Djava.library.path=${natives_directory}',
        ]),
        new Argument(['-cp', '${classpath}']),
    ]

    static from(_versionArgs: Partial<IVersionArguments>) {
        if (_versionArgs instanceof VersionArguments) {
            return _versionArgs
        }

        const { game: _game = [], jvm: _jvm = [] } = _versionArgs
        const versionArgResolver = (value: VersionArgument) => {
            switch (typeof value) {
                case 'string': {
                    return Argument.fromString(value)
                }
                default: {
                    return Argument.from(value)
                }
            }
        }

        return new VersionArguments(_game.map(versionArgResolver), _jvm.map(versionArgResolver))
    }

    static fromLegacyArguments(minecraftArguments: string) {
        const gameArgs = minecraftArguments.split(/\s(?!\$)/g).map(value => Argument.fromString(value))
        return new VersionArguments(gameArgs)
    }

    constructor(private _game: Argument[] = [], private _jvm: Argument[] = VersionArguments.DEFAULT_JVM_ARGS) { }

    get game() { return this._game }

    get jvm() { return this._jvm }

}
