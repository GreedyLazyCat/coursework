export {

}

declare global {
    interface StorageItem {
        id: string,
        parentId: string,
        name: string,
        mimeType: string,
        size: number,
        createdAt: number,
        updatedAt: string | null,
        type: "FOLDER" | "FILE",
        storagePath: string | null,
        hash: string,
        uploadStatus: string
    }
    interface PathItem {
        id: string,
        parent_id: string | null,
        name: string | "Мое хранилище"
    }


}