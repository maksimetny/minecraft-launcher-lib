
import { Artifact, IArtifact } from './artifact';

describe('Artifact', () => {

    describe('#from', () => {

        it('should be able to resolve artifact from artifact id', () => {
            const artifact = Artifact.from('com.mojang:patchy:1.1');
            const path = 'com/mojang/patchy/1.1/patchy-1.1.jar';

            expect(artifact.path).toBe(path);
            expect(artifact.url).toBe('//' + path);
        });

        it('should be able to resolve artifact from artifact id with custom extension', () => {
            const artifact = Artifact.from('com.mojang:patchy:1.1@lzma');
            const path = 'com/mojang/patchy/1.1/patchy-1.1.lzma';

            expect(artifact.path).toBe(path);
            expect(artifact.url).toBe('//' + path);
        });

        it('should be able to resolve artifact from artifact id with classifier', () => {
            const artifact = Artifact.from('org.lwjgl:lwjgl-jemalloc:3.2.1:sources');
            const path = 'org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.jar';

            expect(artifact.path).toBe(path);
            expect(artifact.url).toBe('//' + path);
        });

        it('should be able to resolve artifact from artifact id with classifier and custom extension', () => {
            const artifact = Artifact.from('org.lwjgl:lwjgl-jemalloc:3.2.1:sources@tar.xz');
            const path = 'org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.tar.xz';

            expect(artifact.path).toBe(path);
            expect(artifact.url).toBe('//' + path);
        });

        it('should be able to resolve artifact from normal artifact object', () => {
            const artifact: IArtifact = {
                path: 'com/mojang/patchy/1.1/patchy-1.1.jar',
                sha1: 'aef610b34a1be37fa851825f12372b78424d8903',
                size: 15817,
                url: 'https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar',
            };

            const {
                path,
                sha1,
                size,
                url,
            } = Artifact.from(artifact);

            expect(path).toBe(artifact.path);
            expect(sha1).toBe(artifact.sha1);
            expect(size).toBe(artifact.size);
            expect(url).toBe(artifact.url);
        });

    });

    describe('#toString', () => {

        it('should transform artifact to artifact id', () => {
            const path = 'com/mojang/patchy/1.1/patchy-1.1.jar';
            const artifact = new Artifact(
                path,
                '//' + path,
                15817,
                'aef610b34a1be37fa851825f12372b78424d8903',
            );

            expect(artifact.toString()).toBe('com.mojang:patchy:1.1@jar');
        });

    });

});
