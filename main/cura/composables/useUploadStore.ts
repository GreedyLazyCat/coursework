interface UploadItem {
    storageItemId: string;
    file: File;
    chunkNumber: number;
    totalChunks: number;
    uploadStatus: "INITIALIZED" | "FINISHED" | "UPLOADING"
}

interface StartUploadItem {
    parentId: string;
    name: string;
    mimeType: string;
    uploadType: "REPLACE" | "CONTINUE" | "START";
}

export const useUploadStore = (name: string) => {
    const store = defineStore(name, {
        state: () => ({
            //Сделать настраиваемым
            chunkSize: 5120,
            uploadQueue: [] as UploadItem[]
        }),
        getters: {

        }
        ,
        actions: {
            async addToQueue(item: StartUploadItem, file: File) {
                const data = await $fetch("/api/upload/start", {
                    method: "POST",
                    body: {
                        parentId: item.parentId,
                        name: item.name,
                        mimeType: item.mimeType,
                        uploadType: item.uploadType
                    }
                })
                if (data) {
                    this.uploadQueue.push({
                        file: file,
                        chunkNumber: 1,
                        totalChunks: Math.floor(file.size / this.chunkSize),
                        uploadStatus: "INITIALIZED",
                        storageItemId: data.id
                    })
                }
            },
            async uploadFiles() {
                for (const uploadItem of this.uploadQueue) {

                }
            }
        }
    })
    return store()
}