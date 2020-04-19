
import { dirname, basename } from 'path'
import * as request from 'request'
import { EventEmitter } from 'events'
import { mkdir } from 'shelljs'
import { createHash } from 'crypto'
import { events } from '../../constants'
import {
    createWriteStream,
    existsSync,
    readFileSync
} from 'fs'

export interface IResourceStatus {
    current: number
    total: number
}

export interface IResource {
    path: string
    url: string
    sha1: string
}

export class Resource extends EventEmitter implements IResource {

    static calculateHash(path: string, algorithm = 'sha1'): string {
        return createHash(algorithm).update(readFileSync(path)).digest('hex')
    }

    static parseJSON<T>(path: string): T {
        return JSON.parse(readFileSync(path, 'utf-8'))
    }

    static request = request.defaults({
        pool: {
            maxSockets: 2
        },
        timeout: 1e4
    }) // base request

    constructor(readonly url: string, readonly path: string, readonly sha1: string) { super() }

    /**
     * @param checkHashAfter Check hash after downloading?
     * @returns Download success?
     */
    downloadAsync(checkHashAfter = false) {
        return new Promise<boolean>(resolve => {
            if (!existsSync(this.directory)) {
                try {
                    mkdir('-p', this.directory)
                } catch (err) {
                    this.emit(events.ERROR, `An error occurred while create directory for ${this.path}!`, err)
                    resolve(false)
                    return
                }
            }

            const req = Resource.request(this.url), stream = createWriteStream(this.path)
            const status = { current: 0, total: 0 } as IResourceStatus

            req.on('response', ({ headers, statusCode }) => {
                if (statusCode !== 200) {
                    this.emit(events.ERROR, `An error occurred while download! (${statusCode})`)
                    resolve(false)
                    return
                }

                this.emit(events.DEBUG, `Downloading ${this.path} from ${this.url}`.concat(this.sha1 ? `, with hash: ${this.sha1}..` : '..'))

                const { ['content-length']: contentLength = '0' } = headers
                status.total = parseInt(contentLength, 10)
            })

            req.on('error', err => {
                this.emit(events.ERROR, `An error occurred while download ${this.url} due to ${err.message}`, err)
                resolve(false)
            })

            req.on('data', data => {
                status.current += data.length
                this.emit(events.DOWNLOAD_STATUS, status)
            })

            req.pipe(stream)

            stream.once('finish', () => {
                if (checkHashAfter) {
                    if (!this.isSuccess) {
                        resolve(false)
                        return
                    }
                }

                resolve(true)
            })

            stream.once('error', err => {
                this.emit(events.ERROR, `An error occurred while write ${this.path} due to ${err.message}`, err)
                resolve(false)
            })
        })
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
