
import { readJson } from '../util';
import { join } from 'path';
import { Library } from './library';
import { OS } from '../platform';
import { Rule, RuleAction } from '../rule';

describe('Library', () => {

    describe('#from', () => {

        it('should be able to resolve normal library', () => {
            const name = 'com.mojang:patchy:1.1';
            const path = 'com/mojang/patchy/1.1/patchy-1.1.jar';
            const url = '//' + path;
            const sha1 = 'aef610b34a1be37fa851825f12372b78424d8903';

            const lib = Library.from({
                downloads: {
                    artifact: { path, sha1, url },
                },
                name,
            });

            {
                const { artifact } = lib.downloads;

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe(url);
                expect(artifact.sha1).toBe(sha1);
            } // expect artifact

            expect(lib.name).toBe(name);
        });

        it('should be able to resolve minimum library', () => {
            const name = 'com.mojang:patchy:1.1';
            const path = 'com/mojang/patchy/1.1/patchy-1.1.jar';

            const lib = Library.from({ name });

            {
                const artifact = lib.downloads.artifact;

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe('//' + path);
            }

            expect(lib.name).toBe(name);
        });

        it('should be able to resolve library from name', () => {
            const name = 'com.mojang:patchy:1.1';
            const path = 'com/mojang/patchy/1.1/patchy-1.1.jar';

            const lib = Library.from(name);

            {
                const artifact = lib.downloads.artifact;

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe('//' + path);
            }

            expect(lib.name).toBe(name);
        });

        it('should be able to resolve strange library without downloads', async () => {
            const repo = '//';
            const directory = 'org/lwjgl/lwjgl-openal/3.2.2/';

            const libraryJsonPath = join('mock', 'libraries', 'org', 'lwjgl', 'lwjgl-openal', '3.2.2', 'lwjgl-openal-3.2.2.json');
            const lib = Library.from(await readJson(libraryJsonPath));

            {
                const path = directory + 'lwjgl-openal-3.2.2-natives-windows.jar';

                const { [OS.WINDOWS]: classifier } = lib.natives;
                const artifact = lib.downloads.classifiers[classifier as string];

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe(repo + path);

            }

            {
                const path = directory + 'lwjgl-openal-3.2.2-natives-linux.jar';

                const { [OS.LINUX]: classifier } = lib.natives;
                // expect(typeof classifier).toBe('string');
                const artifact = lib.downloads.classifiers[classifier as string];

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe(repo + path);
            } // expect classificated native linux artifact

            {
                const path = directory + 'lwjgl-openal-3.2.2.jar';
                const artifact = lib.downloads.artifact;

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe(repo + path);
            }
        });

        it('should be able to resolve forge library', () => {
            const name = 'net.minecraftforge:forge:1.14.4-28.2.0';
            const path = 'net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar';
            const url = 'https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar';
            const sha1 = 'afe6f0d2a5341dfbc3c225208ce64d5684ece8f1';

            const lib = Library.from({
                downloads: {
                    artifact: { path, sha1, url },
                },
                name,
            });

            {
                const { artifact } = lib.downloads;

                expect(artifact.path).toBe(path);
                expect(artifact.url).toBe(url);
                expect(artifact.sha1).toBe(sha1);
            }

            expect(lib.name).toBe(name);
        });

    });

    describe('#isApplicable', () => {

        it('enabled features', () => {
            const enabledFeatures: Record<string, boolean> = { download_only: false };
            const downloadOnly = Rule.from({
                action: RuleAction.ALLOW,
                features: { download_only: true },
            });

            expect(
                Library
                    .from({
                        name: 'com.launcher:auth-lib:1.0',
                        rules: [downloadOnly],
                    })
                    .isApplicable({}, enabledFeatures),
            ).toBeFalsy();

            expect(new Library('com.launcher:auth-core:1.0').isApplicable({}, enabledFeatures)).toBeTruthy();
        });

    });

});
