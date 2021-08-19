
import { Folder } from './folder';
import { join } from 'path';

describe('Folder', () => {

    describe('#from', () => {

        it('should instantiate folder from string', () => {
            const folder = Folder.from('launcher');
            expect(folder.path).toBe('launcher');
            expect(folder).toBeInstanceOf(Folder);
        });

    });

    describe('#join', () => {

        it('should return path', () => {
            expect(new Folder('launcher').join('path', 'to', 'target')).toBe(join('launcher', 'path', 'to', 'target'));
        });

    });

});
