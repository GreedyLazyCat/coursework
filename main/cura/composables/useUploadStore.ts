interface UploadItem {
    file: File;
    chunkNumber: number;
    totalChunks: number;
    uploadStatus: "INITIALIZED"
}

const useUploadStore = defineStore("upload-store", {
    state: () => ({
        //Сделать настраиваемым
        chunkSize: 5120,
        uploadQueue: [] as UploadItem[]
    }),
    actions: {
        async addToQueue(item: UploadItem){
            this.uploadQueue.push(item)
            await $fetch("/api/upload/start",{
                method: "POST",
                body: {
                    
                }
            }) 
        }
    }
})