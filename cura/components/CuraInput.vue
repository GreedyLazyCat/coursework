
<script setup lang="ts">
const {name = '', placeholder = '', type='text', hasError = false} = defineProps<{
    name?: string,
    placeholder?: string,
    type?: string,
    hasError?: boolean,
}>()
const model = defineModel<string>({required: false})
</script>
<template>
    <div class="cura-input" :class="{'cura-input--error': hasError}">
        <slot name="leading"></slot>
        <input :type="type" :name="name" id="" :placeholder="placeholder" v-model="model">
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

.cura-input--error {
    border: 1px solid var(--md-sys-color-error);
}
</style>