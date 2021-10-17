
import { Artifact, ArtifactDownloadTaskEvent, IArtifactDownloadTaskProgress } from '../components/artifact';

async function bootstrap() {
    const artifact = Artifact.from({
        path: 'forge-1.14.4-28.0.47.jar',
        sha1: 'e022de358b2f5259e0fc3661f8a0946e6bb88996',
        size: 162697,
        url: 'https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.0.47/forge-1.14.4-28.0.47.jar',
    });

    await artifact.downloadTo('launcher')
        .on(ArtifactDownloadTaskEvent.PROGRESS, (progress: IArtifactDownloadTaskProgress) => {
            console.log(progress);
        })
        .on(ArtifactDownloadTaskEvent.ERROR, (error: Error) => {
            console.error(error);
        })
        .on(ArtifactDownloadTaskEvent.FINISH, () => {
            console.log('completed!');
        })
        .start();
}

bootstrap().catch((err) => console.error(err));
