
import { readJson } from '../components/util';
import { join } from 'path';
import { Library } from '../index';

async function bootstrap() {
    const minLib = Library.from({ name: 'com.mojang:patchy:1.1' });
    console.log('min lib => ', minLib);

    const pathSep = '.';
    const pathParts = minLib.downloads.artifact.path.split(pathSep); // library artifact path patrs
    pathParts.pop(); // remove ext

    const libPath = join('mock', 'libraries', pathParts.concat('json').join(pathSep)); // construct library.json path
    const lib: Library = Library.from(await readJson(libPath));
    console.log('normal lib => ', lib);
}

bootstrap().catch(err => console.error(err));
