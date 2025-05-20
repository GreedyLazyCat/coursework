import { z } from 'zod'
import WriteFileService from '~/lib/writeFileService'

const bodySchema = z.object({
    storageItemId: z.string(),
    chunckNumber: z.number(),
    chunckSize: z.number(),
    hash: z.string(),
    blob: z.any()
})

export default defineEventHandler(async (event) => {
    const body = await readFormData(event)
    const bodyObject = Object.fromEntries(body)
    const fileService = new WriteFileService()
    const fileId = 'asdfasdfasdf'
    fileService.startFileWriting(fileId) 
    fileService.writeFilePart(fileId, bodyObject.blob as File)
})