<script setup lang="ts">
const { name = '', placeholder = '', type = 'text', hasError = false, feedbackClass = '' } = defineProps<{
    name?: string,
    placeholder?: string,
    type?: string,
    hasError?: boolean,
    input?: () => void,
    feedbackClass?: string,
}>()
const model = defineModel<string>({ required: false })
const inputRef = useTemplateRef('inputRef')
const focused = ref(false)
const emit = defineEmits<{
    (e: 'focusChanged', isFocuse: boolean): void
}>()

const handleClick = (e: MouseEvent) => {
    if (e.target !== inputRef.value) {
        e.preventDefault()
    }
    inputRef.value?.focus()
}
const slots = useSlots()
const renderFeedback = computed(() => {
    return !!slots.feedback
})

function focus() {
    focused.value = true
    emit('focusChanged', true)
}
function blur() {
    focused.value = false
    emit('focusChanged', false)
}
</script>
<template>
    <div class="cura-input-container">
        <div class="cura-input" :class="{ 'cura-input--focused': focused, 'cura-input--error': hasError }"
            @mousedown="handleClick">
            <slot name="leading"></slot>
            <input :type="type" :name="name" id="" :placeholder="placeholder" v-model="model" ref="inputRef"
                @focus="focus" @blur="blur" @input="input">
            <slot name="trailing"></slot>
        </div>
        <div v-if="renderFeedback" :class="feedbackClass">
            <slot name="feedback"></slot>
        </div>
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
    transition: outline 0.2s ease-in-out;
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

.cura-input--focused {
    outline: 2px solid var(--md-sys-color-primary);
}

.cura-input--error {
    outline: 2px solid var(--md-sys-color-error);
}
</style>