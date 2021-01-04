
import {
    basename,
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

import {
    events,
} from '../../constants'

import {
    createWriteStream,
    pathExists,
    mkdirp,
    readFile,
    readJson,
} from 'fs-extra'

interface IAxiosResponseData {
    on(e: 'data', listener: (data: Buffer) => void): this
    pipe<T>(destination: T): T
}

interface IAxiosResponse extends AxiosResponse {
    headers: Record<string, string>
    data: IAxiosResponseData
}

export interface IResourceDownloadingProgress {
    currentBytes: number
    totalBytes: number
}

export interface IResource {
    path: string
    url: string
    sha1: string
}

export class Resource extends EventEmitter implements IResource {

    static async calculateHash(path: string, algorithm = 'sha1'): Promise<string> {
        const buffer = await readFile(path)
        return createHash(algorithm).update(buffer).digest('hex')
    }

    static parseJSON<T>(path: string): Promise<T> {
        return readJson(path)
    }

    constructor(private _path: string, private _url: string, private _sha1: string) { super() }

    downloadAsync(checkAfter = false): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const e = await pathExists(this.directory)
                if (!e) await mkdirp(this.directory)
            } catch (err) {
                this.emit(events.ERROR, `An error occurred while create directory for ${this.path}`, err)
                return resolve(false)
            }

            try {
                const sha1 = this.sha1
                const url = this.url
                const path = this.path
                const {
                    headers,
                    data,
                }: IAxiosResponse = await axios({
                    method: 'GET',
                    url,
                    responseType: 'stream',
                })

                this.emit(events.DEBUG, `Downloading ${url} as ${path}`.concat(sha1 ? `, with hash (SHA1) ${sha1}..` : '..'))

                const {
                    ['content-length']: contentLength = '0',
                } = headers

                const progress: IResourceDownloadingProgress = {
                    currentBytes: 0,
                    totalBytes: parseInt(contentLength, 10),
                }

                data.on('data', chunk => {
                    progress.currentBytes += chunk.length
                    this.emit(events.DOWNLOAD_STATUS, progress)
                })

                const stream = createWriteStream(path)
                data.pipe(stream)

                stream.on('finish', async () => {
                    if (checkAfter) {
                        const success = await this.isSuccess()
                        return resolve(success)
                    }

                    resolve(true)
                })

                stream.on('error', err => {
                    this.emit(events.ERROR, `An error occurred while write ${path}`, err)
                    resolve(false)
                })
            } catch (err) {
                this.emit(events.ERROR, `An error occurred while downloading ${this.url} as ${this.path}`, err)
                resolve(false)
            }
        })
    }

    async calculateHash(algorithm: string = 'sha1'): Promise<string> {
        return await Resource.calculateHash(this.path, algorithm)
    }

    async parseJSON<T>(): Promise<T> {
        return await Resource.parseJSON(this.path)
    }

    /**
     * + If resource has a hash, check integrity a file.
     * + If not hash, check presence a file.
     */
    async isSuccess(): Promise<boolean> {
        try {
            const e = await pathExists(this._path)
            if (!e) {
                return e
            }

            const currentSHA1 = await this.calculateHash('sha1')
            const sha1 = this._sha1

            return this.sha1 ? currentSHA1 === sha1 : e
        } catch (err) {
            this.emit(events.ERROR, `An error occurred while check hash of ${this.path}`, err)
            return false
        }
    }

    get path() { return this._path }

    get sha1() { return this._sha1 }

    get name(): string { return basename(this.path) }

    get directory(): string { return dirname(this.path) }

    get url() { return this._url }

}
