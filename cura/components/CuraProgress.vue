<script setup lang="ts">
const { progress = 30 } = defineProps<{
    progress?: number
}>()  
</script>

<template>
    <div class="cura-progress">
        <div class="cura-progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
</template>

<style>
.cura-progress {
    width: 100%;
    height: 4px;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 4px;
}

.cura-progress-bar {
    height: 100%;
    background-color: var(--md-sys-color-primary);
    border-radius: 4px;
}
</style>