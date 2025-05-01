<script setup lang="ts">
const { class: className } = defineProps<{
    class?: string
}>()
const search = ref('')
const showResults = ref(false)

watchEffect(() => {
    if (search.value !== '') {
        showResults.value = true
    } else {
        showResults.value = false
    }
})
</script>
<template>
    <div class="cura-file-search" :class="className">
        <CuraInput placeholder="Поиск по файлам" name="search" type="text" v-model="search">
            <template #leading>
                <Icon name="material-symbols:search" style="font-size: 20px;"></Icon>
            </template>
        </CuraInput>
        <div class="search-results-container" v-if="showResults">
            <div class="search-result-item">
                <span>test.txt</span>
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
    background-color: var(--md-sys-color-secondary-container);
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    color: var(--md-sys-color-on-secondary-container);
    top: 100%;
    width: 100%;
    min-height: 300px;
    margin-top: 8px;
    padding: inherit;
    
}
.search-result-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
}

.cura-file-search {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
}
</style>