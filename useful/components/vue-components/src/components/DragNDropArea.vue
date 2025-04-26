<script setup lang="ts">
import { ref } from 'vue'

const showCover = ref(false)
const emit = defineEmits<{(e: 'filesDropped', files: FileList): void}>()

function drop(e: DragEvent) {
    showCover.value = false
    if(e.dataTransfer && e.dataTransfer.files){
        emit('filesDropped', e.dataTransfer.files)
    }
}
</script>
<template>
    <div class="DragNDropArea" @drop.prevent="drop" @dragover.prevent="" @dragenter.prevent="showCover = true">
        <div class="DragNDropAreaCover" v-if="showCover" @dragleave="showCover = false">
            <div class="DragNDropAreaContent">
                <span>Перетащи файлы сюда, чтобы загрузить.</span> 
            </div>
        </div>
    </div>
</template>

<style>
.DragNDropArea {
    z-index: 100;
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}

.DragNDropAreaCover {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.21);
    backdrop-filter: blur(5.2px);
    -webkit-backdrop-filter: blur(5.2px);
}

.DragNDropAreaContent {
    position: absolute;
    height: 90%;
    width: 90%;
    outline: 2px dashed var(--md-sys-color-primary);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.DragNDropAreaContent span{
    color: var(--md-sys-color-primary);
    font-size: 1.2rem;
    text-align: center;
}
</style>