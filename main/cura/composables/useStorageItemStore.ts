async function fetchFolderItems(folderItemId: string) {
    return await $fetch<StorageItem[]>(`/api/storage-item/read-dir/${folderItemId}`, {
        query: {
            page: 1,
            itemsPerPage: 10
        }
    })
}

export const useStorageItemStore = defineStore("userStorageItems", {
    state: () => ({
        storageItems: [] as StorageItem[],
        currentPath: [] as PathItem[],
        rootId: ''
    }),
    getters: {
        lastItem(): StorageItem {
            return this.storageItems[this.storageItems.length - 1]
        },
        firstItem(): StorageItem {
            return this.storageItems[0]
        },
        lastPathItem(): PathItem | null {
            return this.currentPath[this.currentPath.length - 1]
        },
        firstPathItem(): PathItem | null {
            return this.currentPath[0]
        }
    },
    actions: {
        async openFolder(parentId: string | null, folderId: string, folderName: string) {
            const folderItems = await fetchFolderItems(folderId)
            if (parentId && this.currentPath[this.currentPath.length - 1].id === parentId) {
                this.currentPath.push({
                    id: folderId,
                    parent_id: parentId,
                    name: folderName
                })
            } else {
                const folderPath = await $fetch<PathItem[]>(`/api/storage-item/read-path/${folderId}`)
                folderPath[0].name = "Мое хранилище"
                this.currentPath = folderPath
            }
            this.storageItems = folderItems
            console.log(this.currentPath)
        },
        async openRootFolder() {
            const folderItems = await fetchFolderItems(this.rootId)
            this.currentPath = [{
                id: this.rootId,
                parent_id: null,
                name: "Мое хранилище"
            }]
            this.storageItems = folderItems ?? []
        },
        async updateFolderContents(storageItemId: string, page: number = 1, itemsPerPage: number = 10) {
            const fetchedItems = await useFetch(`/api/storage-item/read-dir/${storageItemId}`, {
                query: {
                    page: page,
                    itemsPerPage: itemsPerPage
                }
            })
            console.log(fetchedItems)
        }
    }
})