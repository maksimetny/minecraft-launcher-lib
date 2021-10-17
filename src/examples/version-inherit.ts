
import { MVersion, IMVersion } from '../components/m-version';
import { readJson } from '../components/util';
import { join } from 'path';

async function bootstrap(): Promise<void> {
    const parentId = '1.14.4';
    const moddedId = '1.14.4-forge-28.0.47';

    const _readJson = (id: string): Promise<Partial<IMVersion>> => readJson(join('mock', 'versions', id, id + '.json'));

    const parent: Partial<IMVersion> = await _readJson(parentId);
    console.log('parent => ', parent);

    const modded: Partial<IMVersion> = await _readJson(moddedId);
    console.log('modded => ', modded);

    const result = MVersion.from(modded, parent);
    console.log('result => ', result);
}

bootstrap().catch(err => console.error(err));
