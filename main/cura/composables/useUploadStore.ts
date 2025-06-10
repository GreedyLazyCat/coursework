interface UploadItem {
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

const useUploadStore = defineStore("upload-store", {
    state: () => ({
        //Сделать настраиваемым
        chunkSize: 5120,
        uploadQueue: [] as UploadItem[]
    }),
    actions: {
        async addToQueue(item: StartUploadItem, file: File) {
            await $fetch("/api/upload/start", {
                method: "POST",
                body: {
                    parentId: item.parentId,
                    name: item.name,
                    mimeType: item.mimeType,
                    uploadType: item.uploadType
                }
            })
            this.uploadQueue.push({
                file: file,
                chunkNumber: 1,
                totalChunks: Math.floor(file.size / this.chunkSize),
                uploadStatus: "INITIALIZED"
            })
        }
    }
})