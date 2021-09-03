
import { Argument, IArgument } from '../../argument';

export type VersionArgument = IArgument['value'] | Partial<IArgument>;

export interface IVersionArguments {
    game: VersionArgument[];
    jvm: VersionArgument[];
}

export class VersionArguments implements IVersionArguments {

    static readonly DEFAULT_JVM_ARGS: Readonly<Argument[]> = [
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

    static from(versionArgs: Partial<IVersionArguments>, parent: Partial<IVersionArguments> = {}): VersionArguments {
        if (versionArgs instanceof VersionArguments) return versionArgs;

        const {
            game: _game = [],
            jvm: _jvm = VersionArguments.DEFAULT_JVM_ARGS.concat(),
        } = parent;
        const {
            game = _game,
            jvm = _jvm,
        } = versionArgs;

        return new VersionArguments(game, jvm);
    }

    static fromLegacyArguments(minecraftArguments: string): VersionArguments {
        return new VersionArguments(
            minecraftArguments
                .split(/\s(?!\$)/g)
                .map(value => Argument.from(value)),
        );
    }

    private _game: Argument[];
    private _jvm: Argument[];

    constructor(
        game: VersionArgument[] = [],
        jvm: VersionArgument[] = VersionArguments.DEFAULT_JVM_ARGS.concat(),
    ) {
        this._game = game.map(gameArg => Argument.from(gameArg));
        this._jvm = jvm.map(jvmArg => Argument.from(jvmArg));
    }

    get game(): Argument[] { return this._game; }

    set game(game: Argument[]) { this._game = game.map(_gameArg => Argument.from(_gameArg)); }

    get jvm(): Argument[] { return this._jvm; }

    set jvm(jvm: Argument[]) { this._jvm = jvm.map(jvmArg => Argument.from(jvmArg)); }

    toJSON(): IVersionArguments {
        const {
            game,
            jvm,
        } = this;
        return {
            game,
            jvm,
        };
    }

}
