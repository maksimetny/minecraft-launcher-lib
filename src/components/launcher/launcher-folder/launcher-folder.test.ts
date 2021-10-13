
import { join } from 'path';
import { LauncherFolder } from './launcher-folder';

describe('LauncherFolder', () => {

    describe('#libraries', () => {

        it('should override libraries directory from constructor', () => {
            const libraries = join('override', 'path', 'of', 'libraries');
            const launcherFolder = new LauncherFolder('launcher', { libraries });

            expect(launcherFolder.libs).toBe('override/path/of/libraries');
            expect(launcherFolder.root).toBe('launcher');
        });

        it('should override libraries directory from setter', () => {
            const launcherFolder = new LauncherFolder('launcher');

            expect(launcherFolder.libs).toBe('launcher/libraries');
            launcherFolder.libs = join('override', 'path', 'of', 'libraries');
            expect(launcherFolder.libs).toBe('override/path/of/libraries');
        });

    });

});
