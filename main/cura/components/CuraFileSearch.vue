<script setup lang="ts">

interface PathItemExtended extends PathItem {
    full_path: string;
}

const { class: className } = defineProps<{
    class?: string
}>()
const search = ref('')
const showResults = ref(false)
const searchResults = ref([] as PathItemExtended[])
const showCloseButton = computed(() => search.value !== '')

const emit = defineEmits<{ (e: 'searchItemClicked', item: PathItemExtended): void }>()

const findByName = async (name: string) => {
    const response = await $fetch('/api/storage-item/find-by-name', {
        method: "POST",
        body: {
            name
        }
    }) as PathItem[]
    let results = [] as PathItemExtended[]
    for (const item of response) {
        const folderPath = await $fetch<PathItem[]>(`/api/storage-item/read-path/${item.id}`)
        folderPath.reverse()
        folderPath[0].name = "Мое хранилище"
        const full_path = folderPath.reduce((acc, curr, index) => {
            if (index === 0) {
                return `${curr.name}/`
            }
            acc += `${curr.name}/`
            return acc
        }, folderPath[0].name)
        results.push({
            ...item,
            full_path
        })
    }
    searchResults.value = results
}

const debouncedFind = debounceAsync(findByName, 250)

function searchItemClicked(item: PathItemExtended) {
    emit('searchItemClicked', item)
    searchResults.value = []
    showResults.value = false
    search.value = ''
}

function debounceAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args).catch(console.error);
        }, delay);
    };
}


watchEffect(async () => {
    if (search.value !== '') {
        debouncedFind(search.value)
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
function clearInput() {
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
                <Icon class="cura-file-search-close-button" @click="clearInput" v-if="showCloseButton"
                    name="material-symbols:close" style="font-size: 20px;"></Icon>
            </template>
        </CuraInput>
        <div class="search-results-container" v-if="showResults">
            <div class="search-result-item" v-for="item in searchResults" :key="item.id"
                @click="searchItemClicked(item)">
                <span>{{ item.name }}</span>
                <span class="search-result-item-path">{{ item.full_path }}</span>
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
    gap: 8px;
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

.cura-file-search-close-button {
    cursor: pointer;
}
</style>