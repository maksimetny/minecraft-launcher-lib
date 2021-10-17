
import { Artifact } from '../artifact';
import { join } from 'path';
import { Asset, IAsset } from './asset';

describe('Asset', () => {

    const objects: Record<string, Omit<IAsset, 'path'>> = {
        'icons/icon_16x16.png': {
            hash: 'bdf48ef6b5d0d23bbb02e17d04865216179f510a',
            size: 3665,
        },
        'icons/icon_32x32.png': {
            hash: '92750c5f93c312ba9ab413d546f32190c56d6f1f',
            size: 5362,
        },
    };

    const subhashes: Record<string, string> = {
        'bdf48ef6b5d0d23bbb02e17d04865216179f510a': 'bd',
        '92750c5f93c312ba9ab413d546f32190c56d6f1f': '92',
    };

    describe('#legacyPath', () => {

        it('should return valid legacy path', () => {
            Object
                .keys(objects)
                .forEach(path => {
                    expect(Asset.from(objects[path], { path }).legacyPath).toBe(join('virtual', 'legacy', path));
                });
        });

    });

    describe('#objectPath', () => {

        it('should return valid object path', () => {
            Object
                .entries(objects)
                .forEach(([path, { hash }]) => {
                    expect(Asset.from(objects[path], { path }).objectPath).toBe(join('objects', subhashes[hash], hash));
                });
        });

    });

    describe('#subhash', () => {

        it('should returns subhash', () => {
            Object.entries(objects).forEach(([path, { hash, size }]) => {
                expect(new Asset(path, hash, size).subhash).toBe(subhashes[hash]);
            });
        });

    });

    describe('#toArtifact', () => {

        it('should returns new artifact instance', () => {
            Object.entries(objects).forEach(([path, { hash, size }]) => {
                expect(new Asset(path, hash, size).toArtifact() instanceof Artifact).toBeTruthy();
            });
        });

    });

});
