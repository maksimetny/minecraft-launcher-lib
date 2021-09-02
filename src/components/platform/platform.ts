
/**
 * Mojang friendly platform name.
 */
export enum OS {
    WINDOWS = 'windows',
    LINUX = 'linux',
    OSX = 'osx',
}

export interface IPlatform {
    arch: string;
    name: OS;
    version: string;
}

import * as os from 'os';

export class Platform implements IPlatform {

    static from(child: Partial<IPlatform>, parent: Partial<IPlatform> = Object.assign({}, Platform.current)): Platform {
        if (child instanceof Platform) return child;

        const {
            version = parent.version,
            name = parent.name,
            arch = parent.arch,
        } = child;

        return new Platform(
            name,
            arch,
            version,
        );
    }

    /**
     * Transforms node platform name to a Mojang-friendly platform name.
     * @param nodePlatform The node platform name. E.g. `win32`.
     */
    static friendlifyNodePlatform(nodePlatform: NodeJS.Platform): OS {
        switch (nodePlatform) {
            case 'win32': return OS.WINDOWS;
            case 'darwin': {
                return OS.OSX;
            }
            default: return OS.LINUX;
        }
    }

    /**
     * The current platform.
     */
    static get current(): Readonly<Platform> {
        return Platform._current ? Platform._current : Platform._current = new Platform();
    }

    private static _current: Platform;

    constructor(
        public name: OS = Platform.friendlifyNodePlatform(os.platform()),
        public arch: string = os.arch(),
        public version: string = os.release(),
    ) { }

    /**
     * The classpath sep for this platform.
     */
    get classpathSeparator(): string {
        return (this.name !== OS.WINDOWS) ? ':' : ';';
    }

}
