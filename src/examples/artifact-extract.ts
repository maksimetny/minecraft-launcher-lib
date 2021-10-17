
import {
    Artifact,
    ArtifactExtractTaskEvent,
    IArtifactExtractTaskProgress,
    IArtifactExtractTaskEntry,
} from '../components/artifact';

async function bootstrap() {
    const artifact = Artifact.from({
        path: 'org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-linux.jar',
        sha1: '9bdd47cd63ce102cec837a396c8ded597cb75a66',
        size: 87484,
        url: 'https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-linux.jar',
    });

    await artifact.extractTo('launcher/libraries', 'launcher/' + artifact.filename.concat('.d'))
        .on(ArtifactExtractTaskEvent.PROGRESS, (progress: IArtifactExtractTaskProgress) => {
            console.log(progress);
        })
        .on(ArtifactExtractTaskEvent.EXCLUDE, (fileName: string) => {
            console.log(fileName + ' excluded');
        })
        .on(ArtifactExtractTaskEvent.FINISH, () => {
            console.log('completed!');
        })
        .on(ArtifactExtractTaskEvent.ENTRY, ({ fileName }: IArtifactExtractTaskEntry) => {
            console.log('extracting ' + fileName);
        })
        .on(ArtifactExtractTaskEvent.ERROR, (error: Error) => {
            console.error(error);
        })
        .start();
}

bootstrap().catch((err) => console.error(err));
