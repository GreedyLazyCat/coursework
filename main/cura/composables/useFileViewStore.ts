interface SimpleModal {
    showModal: boolean;
    action: () => void;
    title: string;
    text: string;
    actionName: string;
}

export const useFileViewStore = (id: string) => {
    const store = defineStore(id, {
        state: () => ({
            simpleModal: {} as SimpleModal,
            showRenameModal: false,
            showMoveModal: false,
            showCreateFolderModal: false,
            fileBeingRenamed: {} as StorageItem | null,

        }),
        getters: {
        },
        actions: {
            closeRenameModal() {
                this.showRenameModal = false
            },
            openRenameModal() {
                this.showRenameModal = true
            },
            openMoveModal() {
                this.showMoveModal = true
            },
            closeMoveModal() {
                this.showMoveModal = false
            },
            openCreateFolderModal() {
                this.showCreateFolderModal = true
            },
            closeCreateFolderModal() {
                this.showCreateFolderModal = false
            },
        }
    })
    return store()
}