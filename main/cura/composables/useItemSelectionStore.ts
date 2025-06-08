
export const useItemSelectionStore = (id: string) => {
    const store = defineStore(id, {
        state: () => ({
            selectedItems: [] as StorageItem[]
        }),
        getters: {
            isEmpty(): boolean {
                return this.selectedItems.length === 0
            },
            isNotEmpty(): boolean {
                return this.selectedItems.length > 0
            }
        },
        actions: {
            add(item: StorageItem) {
                this.selectedItems.push(item)
            },
            clear() {
                this.selectedItems = []
            },
            remove(item: StorageItem){
            
            }
        }
    })
    return store()
}