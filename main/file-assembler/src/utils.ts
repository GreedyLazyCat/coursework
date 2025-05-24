import * as fs from 'fs'
import { uploadChunk } from './db/schema.js'
import { join, resolve } from 'path'

type chunkType = typeof uploadChunk.$inferSelect

function resolvePartsDir(storageItemId: string) {
    const uploadsDir = resolve(process.env.NUXT_FILES_FOLDER_PATH!)
    return join(uploadsDir, 'parts', storageItemId)
}

export function assebmleFile(storageItemId: string, chunks: chunkType[]) {
    const partsDir = resolvePartsDir(storageItemId)
    const uploadsDir = resolve(process.env.NUXT_FILES_FOLDER_PATH!)
    for (const chunk of chunks) {
        const chunkPath = join(partsDir, `${chunk.chunkNumber}_${chunk.hash}`)
        if(!fs.existsSync(chunkPath)){
            throw new Error("No chunk with such type, cannot assemble file")
        }
        const chunkFile = fs.readFileSync(chunkPath)
        fs.appendFileSync(join(uploadsDir, storageItemId), chunkFile)
    }
    fs.rmSync(partsDir, { recursive: true, force: true })
}