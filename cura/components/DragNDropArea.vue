<script setup lang="ts">
import { ref } from 'vue'

const showCover = ref(false)
const emit = defineEmits<{ (e: 'filesDropped', files: FileList): void }>()
const parent = useTemplateRef('parent')
const { class: className } = defineProps<{
    class?: string
}>()


function drop(e: DragEvent) {
    showCover.value = false
    if (e.dataTransfer && e.dataTransfer.files) {
        emit('filesDropped', e.dataTransfer.files)
    }
}

function dragLeave(e: DragEvent) {
    if(parent.value && e.relatedTarget && parent.value.contains(e.relatedTarget as HTMLElement))
        return
    showCover.value = false
}
</script>
<template>
    <div ref="parent" class="DragNDropArea" @drop.prevent="drop" @dragover.prevent="" @dragenter.prevent="showCover = true"
        @dragleave="dragLeave" :class="className">
        <slot></slot>
        <div class="DragNDropAreaCover" v-if="showCover">
            <div class="DragNDropAreaContent">
                <span>Перетащи файлы сюда, чтобы загрузить.</span>
            </div>
        </div>
    </div>
</template>

<style>
.DragNDropArea {
    height: 100%;
    width: 100%;
    overflow: scroll;
    position: relative;
}


.DragNDropAreaCover {
    z-index: 100;
    left: 0;
    top: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    background: var(--md-sys-color-surface-container-highest);
    backdrop-filter: blur(5.2px);
    -webkit-backdrop-filter: blur(5.2px);
    pointer-events: none;
}

.DragNDropAreaContent {
    position: absolute;
    height: 90%;
    width: 90%;
    outline: 2px dashed var(--md-sys-color-on-primary-container);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.DragNDropAreaContent span {
    color: var(--md-sys-color-on-primary-container);
    font-size: 1.2rem;
    text-align: center;
}
</style>