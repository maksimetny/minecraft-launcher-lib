
import { Folder } from './folder';
import { join } from 'path';

describe('Folder', () => {

    describe('#from', () => {

        it('should resolve folder from string', () => {
            const dir = 'launcher';
            const folder = Folder.from(dir);

            expect(folder.path).toBe(dir);
            expect(folder).toBeInstanceOf(Folder);
        });

    });

    describe('#join', () => {

        it('should returns correct path', () => {
            const paths = ['launcher', 'path', 'to', 'target'];
            expect(new Folder(paths[0]).join(...paths.slice(1))).toBe(join(...paths));
        });

    });

});
