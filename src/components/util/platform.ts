
export enum OS { WINDOWS = 'windows', LINUX = 'linux', OSX = 'osx' } // mojang friendly OS

export interface IPlatform {
    arch: string
    name: OS
    version: string
}

// export type Platform = Partial<IPlatform>

import { arch, release } from 'os'

export class CurrentPlatform implements IPlatform {

    static getPlatformName(): OS {
        switch (process.platform) {
            case 'win32': {
                return OS.WINDOWS
            }
            case 'darwin': {
                return OS.OSX
            }
            default: {
                return OS.LINUX
            } // linux and other (unknown)..
        }
    }

    static getPlatformArch() { return arch() }

    static getPlatformVersion() { return release() }

    static getPlatformSeparator(os = currentPlatform.name) {
        switch (os) {
            case OS.WINDOWS: return ';'
            default: return ':'
        }
    }

    readonly arch = CurrentPlatform.getPlatformArch()
    readonly version = CurrentPlatform.getPlatformVersion()
    readonly name = CurrentPlatform.getPlatformName()

}

export const currentPlatform = new CurrentPlatform()
