
import * as yauzl from 'yauzl';
import { join } from 'path';
import mkdirp from 'mkdirp';
import { createWriteStream, existsSync } from 'fs';
import { IArtifact } from '../../artifact';
import { ArtifactTask } from '../artifact-task';
import { exists } from '../../../util';

export interface IArtifactExtractTaskProgress {
    total: number;
    completed: number;
}

export const enum ArtifactExtractTaskEvent {
    PROGRESS = 'progress',
    EXCLUDE = 'exclude',
    FINISH = 'finish',
    ENTRY = 'entry',
    ERROR = 'error',
}

export interface IArtifactExtractTaskEntry {
    fileName: string;
    uncompressedSize: number;
    compressedSize: number;
}

export class ArtifactExtractTask extends ArtifactTask {

    constructor(
        artifact: Partial<IArtifact>,
        public readonly artifactRoot: string,
        public readonly extractionRoot: string,
        public exclude: string[] = ['META-INF/'],
    ) {
        super(artifact);
    }

    async start(): Promise<this> {
        const extractionRootExist = await exists(this.extractionRoot);

        if (!extractionRootExist) {
            await mkdirp(this.extractionRoot);
        }

        return new Promise<this>((resolve, reject) => {
            const fileOptions: yauzl.Options = { autoClose: true, lazyEntries: true };
            const filePath = join(this.artifactRoot, this.artifact.path);

            yauzl.open(filePath, fileOptions, (err, file) => {
                if (err) {
                    return reject(err);
                }
                if (!file) {
                    return reject(new Error('cannot open zip file'));
                }

                const progress: IArtifactExtractTaskProgress = {
                    total: file.entryCount,
                    completed: 0,
                };

                const nextEntry = () => {
                    progress.completed++;
                    this.emit(ArtifactExtractTaskEvent.PROGRESS, progress);
                    file.readEntry();
                };

                file
                    .on('entry', (entry: yauzl.Entry) => {
                        const {
                            fileName,
                            uncompressedSize,
                            compressedSize,
                        } = entry;
                        const _entry: IArtifactExtractTaskEntry = {
                            fileName,
                            uncompressedSize,
                            compressedSize,
                        };

                        this.emit(ArtifactExtractTaskEvent.ENTRY, _entry);

                        const exclude: boolean = this.exclude
                            .map(e => entry.fileName.startsWith(e))
                            .includes(true);

                        if (exclude) {
                            this.emit(ArtifactExtractTaskEvent.EXCLUDE, fileName);
                            return nextEntry();
                        }

                        file.openReadStream(entry, (err, readStream) => {
                            if (err) {
                                return reject(err);
                            }
                            if (!readStream) {
                                return reject(new Error('cannot open read stream from zip file'));
                            }

                            const filePath = join(this.extractionRoot, fileName);

                            if (fileName.endsWith('/')) {
                                try {
                                    mkdirp.sync(filePath);
                                } catch (err) {
                                    this.emit(ArtifactExtractTaskEvent.ERROR, err);
                                }

                                return nextEntry();
                            }

                            if (existsSync(filePath)) {
                                return nextEntry();
                            }

                            const writeStream = createWriteStream(filePath);

                            writeStream
                                .on('finish', () => {
                                    nextEntry();
                                })
                                .on('error', (err) => {
                                    this.emit(ArtifactExtractTaskEvent.ERROR, err);
                                });

                            readStream.pipe(writeStream);
                        });
                    })
                    .on('end', () => {
                        this.emit(ArtifactExtractTaskEvent.FINISH);
                        resolve(this);
                    });

                file.readEntry(); // start read entries
            });
        });
    }

}
