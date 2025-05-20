<script setup lang="ts">
const { class: className } = defineProps<{
    class?: string
}>()
const search = ref('')
const showResults = ref(false)
const showCloseButton = computed(() => search.value !== '')

const emit = defineEmits<{ (e: 'searchItemClicked', item: string): void }>()

watchEffect(() => {
    if (search.value !== '') {
        showResults.value = true
    } else {
        showResults.value = false
    }
})

const onOutsideClick = (e: MouseEvent) => {
    if (!e.target) return
    if (!(e.target as HTMLElement).closest('.cura-file-search')) {
        showResults.value = false
    }
}
function handleFocusChange(isFocused: boolean) {
    if (isFocused && search.value !== '') {
        showResults.value = true
    }
}
function clearInput(){
    search.value = ''
    showResults.value = false
}

onMounted(() => {
    document.addEventListener('click', onOutsideClick)
})
onUnmounted(() => {
    document.removeEventListener('click', onOutsideClick)
})
</script>
<template>
    <div class="cura-file-search" :class="className">
        <CuraInput @focus-changed="handleFocusChange" placeholder="Поиск по файлам" name="search" type="text"
            v-model="search">
            <template #leading>
                <Icon name="material-symbols:search" style="font-size: 20px;"></Icon>
            </template>
            <template #trailing>
                <Icon class="cura-file-search-close-button" @click="clearInput" v-if="showCloseButton" name="material-symbols:close" style="font-size: 20px;"></Icon>
            </template>
        </CuraInput>
        <div class="search-results-container" v-if="showResults">
            <div class="search-result-item" @click="emit('searchItemClicked', 'test.txt')">
                <span>test.txt</span>
                <span class="search-result-item-path">path/to/file</span>
            </div>
        </div>
    </div>
</template>
<style>
.search-results-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 100;
    background-color: var(--md-sys-color-surface-container-highest);
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    top: 100%;
    width: 100%;
    min-height: 300px;
    margin-top: 8px;
    box-sizing: border-box;
    padding: 8px;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
}

.search-result-item-container {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    padding: 8px;
    position: relative;
}

.cura-file-search {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
}

.search-result-item-path {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    opacity: 0.5;
}
.cura-file-search-close-button{
    cursor: pointer;
}
</style>