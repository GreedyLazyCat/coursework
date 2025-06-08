async function fetchFolderItems(folderItemId: string) {
    return await $fetch<StorageItem[]>(`/api/storage-item/read-folder/${folderItemId}`, {
        query: {
            page: 1,
            itemsPerPage: 10
        }
    })
}

export const useStorageItemStore = (name: string) => {
    const store = defineStore(name, {
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
                const folderIndex = this.currentPath.findIndex((e) => e.id === folderId)
                // console.log(`${parentId}, ${folderId}, ${folderName}`)
                if (parentId && this.currentPath[this.currentPath.length - 1].id === parentId) {
                    this.currentPath.push({
                        id: folderId,
                        parent_id: parentId,
                        name: folderName
                    })
                } else if (folderIndex !== -1) {
                    this.currentPath = this.currentPath.slice(0, folderIndex + 1)
                } else {
                    const folderPath = await $fetch<PathItem[]>(`/api/storage-item/read-path/${folderId}`)
                    folderPath.reverse()
                    folderPath[0].name = "Мое хранилище"
                    this.currentPath = folderPath
                }
                this.storageItems = folderItems
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
                const fetchedItems = await useFetch(`/api/storage-item/read-folder/${storageItemId}`, {
                    query: {
                        page: page,
                        itemsPerPage: itemsPerPage
                    }
                })
                console.log(fetchedItems)
            },
            async createFolder(name: string) {
                const created = await $fetch<StorageItem>("/api/storage-item/create-folder", {
                    method: "POST",
                    body: {
                        name,
                        parentId: this.lastPathItem?.id
                    }
                })
                console.log(created)
                this.storageItems.push(created)
            },
            async updateFile(item: StorageItem) {
                const foundItem = this.storageItems.find((e) => e.id === item.id)
                if (foundItem) {
                    foundItem.name = item.name
                    await $fetch(`/api/storage-item/update/${item.id}`, {
                        method: "PUT",
                        body: item
                    })
                }
            },
            async deleteItem(item: StorageItem) {
                const foundItemIndex = this.storageItems.findIndex((e) => e.id === item.id)
                if (foundItemIndex !== -1) {

                    await $fetch(`/api/storage-item/delete/${item.id}`, {
                        method: "DELETE"
                    })
                    this.storageItems.splice(foundItemIndex, 1)
                }
            }
        }
    })
    return store()
}