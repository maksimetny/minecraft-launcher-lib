
import { Argument, IArgument } from '../../argument';

export type MVersionArgument = IArgument['value'] | Partial<IArgument>;

export interface IMVersionArguments {

    /**
     * This contains args for `minecraft.jar`.
     */
    game: MVersionArgument[];

    /**
     * The JVM args.
     */
    jvm: MVersionArgument[];

}

export class MVersionArguments implements IMVersionArguments {

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

    static from(child: Partial<IMVersionArguments>, parent?: Partial<IMVersionArguments>): MVersionArguments {
        if (!parent) {
            if (child instanceof MVersionArguments) return child;
            parent = {};
        }

        const {
            game = parent.game,
            jvm = parent.jvm,
        } = child;

        return new MVersionArguments(game, jvm);
    }

    static fromLegacyArguments(minecraftArguments: string): MVersionArguments {
        return new MVersionArguments(minecraftArguments.split(/\s(?!\$)/g));
    }

    private _game: Argument[];
    private _jvm: Argument[];

    constructor(
        game: MVersionArgument[] = [],
        jvm: MVersionArgument[] = MVersionArguments.DEFAULT_JVM_ARGS.concat(),
    ) {
        this._game = game.map(gameArg => Argument.from(gameArg));
        this._jvm = jvm.map(jvmArg => Argument.from(jvmArg));
    }

    get game(): Argument[] { return this._game; }

    set game(game: Argument[]) {
        this._game = game.map(gameArg => Argument.from(gameArg));
    }

    get jvm(): Argument[] { return this._jvm; }

    set jvm(jvm: Argument[]) {
        this._jvm = jvm.map(jvmArg => Argument.from(jvmArg));
    }

    toJSON(): IMVersionArguments {
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
