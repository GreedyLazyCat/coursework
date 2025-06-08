
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
            },
            length(): number {
                return this.selectedItems.length
            },
            hasItem() {
                return (item: StorageItem) => {
                    return this.selectedItems.findIndex((e) => e.id === item.id) !== -1
                }
            }
        },
        actions: {
            add(item: StorageItem) {
                if (!this.hasItem(item)) {
                    this.selectedItems.push(item)
                }
            },
            clear() {
                this.selectedItems = []
            },
            remove(item: StorageItem) {

            }
        }
    })
    return store()
}