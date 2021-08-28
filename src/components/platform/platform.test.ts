
import { Platform, OS, IPlatform } from './platform';
import * as os from 'os';

describe('Platform', () => {

    describe('#from', () => {

        it('should be able to replace missing properties with default properties', () => {
            const parentPlatform: IPlatform = {
                name: OS.LINUX,
                arch: 'x64',
                version: 'release',
            };
            const platform = Platform.from({}, parentPlatform);

            expect(platform.version).toBe(parentPlatform.version);
            expect(platform.name).toBe(parentPlatform.name);
            expect(platform.arch).toBe(parentPlatform.arch);
        });

    });

    describe('#current', () => {

        it('returns current platform name', () => {
            let expectedName: string;

            switch (os.platform()) {
                case 'win32': {
                    expectedName = OS.WINDOWS;
                    break;
                }
                case 'darwin': {
                    expectedName = OS.OSX;
                    break;
                }
                default: {
                    expectedName = OS.LINUX;
                    break;
                } // linux and unknown
            }

            expect(Platform.current.name).toBe(expectedName);
        });

        it('returns current platform arch', () => {
            expect(Platform.current.arch).toBe(os.arch());
        });

        it('returns current platform version', () => {
            expect(Platform.current.version).toBe(os.release());
        });

    });

    describe('#classpathSeparator', () => {

        describe('returns current classpath separator', () => {

            it('on windows', () => {
                expect(new Platform(OS.WINDOWS).classpathSeparator).toBe(';');
            });

            it('on linux and osx', () => {
                expect(new Platform(OS.LINUX).classpathSeparator).toBe(':');
            });

        });

    });

});
