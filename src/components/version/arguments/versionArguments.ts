
import { Argument, IArgument } from '../../argument';

export type VersionArgument = string | Partial<IArgument>;

export interface IVersionArguments { game: VersionArgument[]; jvm: VersionArgument[] }

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
    ];

    static from(_versionArgs: Partial<IVersionArguments>): VersionArguments {
        if (_versionArgs instanceof VersionArguments) return _versionArgs;
        const { game: _game = [], jvm: _jvm = [] } = _versionArgs;
        const resolveArg = (value: VersionArgument) => {
            switch (typeof value) {
                case 'string': {
                    return Argument.fromString(value);
                }
                default: {
                    return Argument.from(value);
                }
            }
        };

        return new VersionArguments(_game.map(resolveArg), _jvm.map(resolveArg));
    }

    static fromLegacyArguments(minecraftArguments: string): VersionArguments {
        const gameArgs = minecraftArguments.split(/\s(?!\$)/g).map(value => Argument.fromString(value));
        return new VersionArguments(gameArgs);
    }

    constructor(private _game: Argument[] = [], private _jvm: Argument[] = VersionArguments.DEFAULT_JVM_ARGS) { }

    get game(): Argument[] { return this._game; }

    set game(_game: Argument[]) { this._game = _game; }

    get jvm(): Argument[] { return this._jvm; }

    set jvm(_jvm: Argument[]) { this._jvm = _jvm; }

}
