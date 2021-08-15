
import {
    basename,
    join,
    dirname,
} from 'path'

import axios, {
    AxiosResponse,
    AxiosInstance,
} from 'axios'

import { EventEmitter } from 'events'

import {
    createHash,
} from 'crypto'

import { baseEvents } from '../../constants/events'

import {
    createWriteStream,
    pathExists,
    ensureDir,
    readFile,
    readJson,
} from 'fs-extra'

import {
    open,
    Options as ZipOptions,
    Entry as ZipEntry,
    ZipFile,
} from 'yauzl'

import {
    Readable,
} from 'stream'

interface IAxiosResponseData {
    on(e: 'data', listener: (chunk: Buffer) => void): this
    pipe<T>(dest: T): T
}

interface IAxiosResponse extends AxiosResponse {
    headers: Record<string, string>
    data: IAxiosResponseData
}

export interface IResourceDownloadProgress {
    bytes: {
        current: number
        total: number
    }
}

// export interface IResourceExtractProgress { } TODO

export interface IResource {
    path: string
    url: string
    sha1: string
}

export class Resource extends EventEmitter implements IResource {

    static async calculateHash(resource: Pick<IResource, 'path'>, algorithm = 'sha1'): Promise<string> {
        return createHash(algorithm)
            .update(await readFile(resource.path))
            .digest('hex')
    }

    static parseJSON<T>(resource: Pick<IResource, 'path'>): Promise<T> {
        return readJson(resource.path)
    }

    constructor(
        private _path: string,
        private _url: string,
        private _sha1: string,
    ) { super() }

    download(checkAfter = false): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const sha1 = this.sha1
            const url = this.url
            const path = this.path

            try {
                await ensureDir(this.directory)
            } catch (err) {
                this.emit(baseEvents.ERROR, 'an error occurred while create directory', err)
                resolve(false)
                return
            }

            try {
                const {
                    headers,
                    data: dataStream,
                }: IAxiosResponse = await axios({
                    method: 'GET',
                    url,
                    responseType: 'stream',
                })

                this.emit(baseEvents.DEBUG, `downloading from ${url}`.concat(sha1 ? ` with hash (SHA1) ${sha1}..` : '..'))

                const {
                    ['content-length']: contentLength = '0',
                } = headers

                const progress: IResourceDownloadProgress = {
                    bytes: {
                        current: 0,
                        total: parseInt(contentLength, 10),
                    },
                }

                dataStream.on('data', chunk => {
                    progress.bytes.current += chunk.length
                    this.emit('download-status', progress)
                })

                const writeStream = createWriteStream(path)
                dataStream.pipe(writeStream)

                writeStream.on('finish', async () => {
                    let success = true
                    if (checkAfter) {
                        success = await this.isSuccess()
                    }

                    this.emit(baseEvents.DEBUG, success ? `download successful` : `download not successful`)
                    resolve(success)
                })
                writeStream.on('error', err => {
                    this.emit(baseEvents.ERROR, 'an error occurred while write', err)
                    resolve(false)
                })
            } catch (err) {
                this.emit(baseEvents.ERROR, `an error occurred while download`, err)
                resolve(false)
            }
        })
    }

    calculateHash(algorithm: string = 'sha1'): Promise<string> {
        return Resource.calculateHash(this, algorithm)
    }

    parseJSON<T>(): Promise<T> {
        return Resource.parseJSON(this)
    }

    async isSuccess(): Promise<boolean> {
        try {
            const e = await pathExists(this._path)
            if (e) {
                if (this._sha1) {
                    const currentSHA1 = await this.calculateHash('sha1')
                    return this._sha1 === currentSHA1
                }
                // if md5 or other
            }

            return e
        } catch (err) {
            this.emit(baseEvents.ERROR, 'an error occurred while check hash', err)
            return false
        }
    }

    async extractTo(directory: string, checkHash = true, exclude: string[] = ['META-INF/']): Promise<void> {
        const options: ZipOptions = { autoClose: false, lazyEntries: true }
        const file = await new Promise<ZipFile>((resolve, reject) => {
            open(this.path, options, (err, file) => {
                if (err) {
                    return reject(err)
                }
                if (!file) {
                    return reject()
                } // cannot open zip

                resolve(file)
            })
        })
        const entries: ZipEntry[] = []

        await new Promise<void>((resolve, reject) => {
            file.on('entry', entry => {
                const e = exclude
                    .map(excludeName => entry.fileName.startsWith(excludeName))
                    .includes(true)
                if (!e) entries.push(entry)

                file.readEntry() // next entry
            })
            file.on('end', () => { resolve() })

            file.readEntry() // start read entries
        })

        function openReadStream(entry: ZipEntry): Promise<Readable> {
            return new Promise((resolve, reject) => {
                file.openReadStream(entry, (err, readStream) => {
                    if (err) {
                        return reject(err)
                    }
                    if (!readStream) {
                        return reject()
                    }

                    resolve(readStream)
                })
            })
        }

        const hashName = /.(sha1$)/
        const hashesPromises = entries
            .filter(({ fileName }) => {
                return hashName.test(fileName)
            })
            .map(async entry => {
                try {
                    const readStream = await openReadStream(entry)
                    const chunks: Buffer[] = []

                    await new Promise<void>((resolve, reject) => {
                        readStream.on('data', chunk => {
                            chunks.push(chunk)
                        })
                        readStream.on('end', () => { resolve() })
                        readStream.on('error', err => {
                            reject(err)
                        })
                    })

                    const nameSep = '.'
                    const nameParts = entry.fileName.split(nameSep)
                    nameParts.pop()
                    const name = nameParts.join(nameSep)

                    const targetNameSep = '/'
                    const targetName = entry.fileName.split(targetNameSep).slice(0, -1).concat(name).join(targetNameSep)
                    const targetHash = Buffer.concat(chunks).toString().trim()

                    return [targetName, targetHash]
                } catch (err) {
                    // TODO emit message
                    return []
                }
            })

        const hashes: Record<string, string> = Object.fromEntries(await Promise.all(hashesPromises))

        await ensureDir(directory)

        const extractPromises = entries
            .map(entry => {
                return new Promise<void>(async (resolve, reject) => {
                    const { fileName: name } = entry
                    try {
                        const path = join(directory, name)
                        const sha1 = hashes[name]
                        if (name.endsWith('/')) {
                            await ensureDir(path)
                            resolve()
                            return
                        }

                        const e = await pathExists(path)
                        if (e) {
                            if (sha1) {
                                const currentSHA1 = await Resource.calculateHash({ path })
                                if (sha1 === currentSHA1) {
                                    resolve()
                                    return
                                }
                            } else {
                                resolve()
                                return
                            }
                        }

                        this.emit(baseEvents.DEBUG, `extracting ${path}`.concat(sha1 ? `, with hash (SHA1) ${sha1}..` : '..'))

                        const readStream = await openReadStream(entry), writeStream = createWriteStream(path)

                        writeStream.on('finish', () => {
                            this.emit(baseEvents.DEBUG, `${name} extracted`)
                            resolve()
                        })
                        writeStream.on('error', err => {
                            reject(err)
                        })

                        readStream.pipe(writeStream)
                    } catch (err) {
                        this.emit(baseEvents.ERROR, `an error occurred while extract ${name}`, err)
                        resolve()
                    }
                })
            })

        await Promise.all(extractPromises)
        file.close()
    }

    get path() { return this._path }

    get url() { return this._url }

    get sha1() { return this._sha1 }

    get name(): string {
        return basename(this.path)
    }

    get directory(): string { return dirname(this.path) }

}
