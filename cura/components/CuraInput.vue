
<script setup lang="ts">
const {name = '', placeholder = '', type='text'} = defineProps<{
    name?: string,
    placeholder?: string,
    type?: string,
}>()
</script>
<template>
    <div class="cura-input">
        
        <slot name="leading"></slot>
        <input :type="type" :name="name" id="" :placeholder="placeholder">
        <slot name="trailing"></slot>
    </div>
</template>
<style>
.cura-input {
    border: 1px solid var(--md-sys-color-outline);
    padding: 8px 12px;
    border-radius: var(--input-border-radius);
    background-color: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
}


.cura-input:hover {
    cursor: text;
}

.cura-input input {
    border: none;
    padding: 0;
    background-color: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    width: 100%;
    font-size: var(--input-font-size);
    margin: 0 8px;
}

.cura-input input:focus {
    outline: none;
}
</style>