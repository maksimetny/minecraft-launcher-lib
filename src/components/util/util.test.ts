
import { readJson } from './util';
import { ILibrary } from '../library';

describe('util', () => {

    describe('#readJson', () => {

        it('should returns parsed json object', async () => {
            const libraryJsonPath = 'mock/libraries/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.json';
            const library: Partial<ILibrary> = await readJson(libraryJsonPath);

            expect(library.name).toBe('org.lwjgl:lwjgl-openal:3.2.2');
        });

    });

});
