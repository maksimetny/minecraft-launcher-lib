
import { dirname, basename } from 'path'
import axios, { AxiosResponse, AxiosInstance } from 'axios'
import { EventEmitter } from 'events'
import { mkdir } from 'shelljs'
import { createHash } from 'crypto'
import { events } from '../../constants'
import {
    createWriteStream,
    existsSync,
    readFileSync
} from 'fs'

interface IAxiosResponseData {
    on(e: 'data', listener: (data: Buffer) => void): this
    pipe<T>(destination: T): T
}

interface IAxiosResponse extends AxiosResponse {
    headers: { [key: string]: string }
    data: IAxiosResponseData
}

export interface IResourceDownloadingProgress {
    current: number
    total: {
        expected: number
        received: number
    }
}

export interface IResource {
    readonly path: string
    readonly url: string
    readonly sha1: string
}

const handleError = (err: Partial<Error>) => {
    return err.message ? err.message.toLocaleLowerCase() : 'unknown'
}

export class Resource extends EventEmitter implements IResource {

    static calculateHash(path: string, algorithm = 'sha1'): string {
        return createHash(algorithm).update(readFileSync(path)).digest('hex')
    }

    static parseJSON<T>(path: string): T {
        return JSON.parse(readFileSync(path, 'utf-8'))
    }

    constructor(readonly url: string, readonly path: string, readonly sha1: string, private request: AxiosInstance = axios) { super() }

    /**
     * @returns This download is success?
     */
    async downloadAsync(checkAfter = false): Promise<boolean> {
        try {
            if (!existsSync(this.directory)) mkdir('-p', this.directory)
        } catch (err) {
            const message = handleError(err)
            this.emit(events.ERROR, `An error occurred while create directory for ${this.path} due to ${message}!`, err)
            return false
        }

        try {
            const { headers, data }: IAxiosResponse = await this.request({
                url: this.url,
                method: 'GET',
                responseType: 'stream'
            })

            this.emit(events.DEBUG, `Downloading ${this.path} from ${this.url}`.concat(this.sha1 ? `, with hash: ${this.sha1}..` : '..'))

            {
                const { ['content-length']: contentLength = '0' } = headers

                const _progress: IResourceDownloadingProgress = {
                    current: 0,
                    total: {
                        expected: 0,
                        received: parseInt(contentLength, 10)
                    }
                }

                data.on('data', chunk => {
                    _progress.current += chunk.length
                    this.emit(events.DOWNLOAD_STATUS, _progress)
                })
            }

            const stream = createWriteStream(this.path)

            data.pipe(stream)

            return new Promise(resolve => {
                stream.on('finish', () => {
                    resolve(checkAfter ? (this.isSuccess ? true : false) : true)
                })

                stream.on('error', err => {
                    const message = handleError(err)
                    this.emit(events.ERROR, `An error occurred while write ${this.path} due to ${message}`, err)
                    resolve(false)
                })
            })

        } catch (err) {
            const message = handleError(err)
            this.emit(events.ERROR, `An error occurred while downloading ${this.url} due to ${message}`, err)
            return false
        }
    }

    calculateHash(algorithm: string): string {
        return Resource.calculateHash(this.path, algorithm)
    }

    parseJSON<T>(): T {
        return Resource.parseJSON(this.path)
    }

    /**
     * + If resource has a hash, check integrity a file.
     * + If not hash, check presence a file.
     */
    get isSuccess(): boolean {
        try {
            const e = existsSync(this.path)
            if (!e) return e
            return this.sha1 ? this.calculateHash('sha1') === this.sha1 : e
        } catch (err) {
            this.emit(events.ERROR, `An error occurred while check hash of ${this.path}`, err)
            return false
        }
    }

    get name(): string {
        return basename(this.path)
    }

    get directory(): string {
        return dirname(this.path)
    }

}
