<script setup lang="ts">

const { class: className = '' } = defineProps<{
    class?: string
}>()

const state = reactive({
    top: 0,
    left: 0,
    opacity: 0,
})
const isOpen = ref(true)
const menuRootRef = ref<HTMLElement>()
const menuContentRef = ref<HTMLElement>()
let width = 0
let height = 0

function open(e: MouseEvent) {
    if (!menuContentRef.value) {
        return
    }
    isOpen.value = true

    state.top = Math.min(e.clientY, window.innerHeight - height)
    state.left = Math.min(e.clientX, window.innerWidth - width)
}

onMounted(() => {
    if (menuContentRef.value) {
        width = menuContentRef.value.getBoundingClientRect().width
        height = menuContentRef.value.getBoundingClientRect().height
        isOpen.value = false 
        state.opacity = 1
    }
    window.addEventListener('mouseup', (e: MouseEvent) => {
        if (e.button === 0) {
            isOpen.value = false
        }
        else if (e.button === 2 && e.target !== menuRootRef.value && e.target !== menuContentRef.value) {
            isOpen.value = false
        }
    })
})

</script>

<template>
    <div class="cura-context-menu-root" ref="menuRootRef" @contextmenu.prevent="open">
        <div class="cura-context-menu-content" v-show="isOpen" ref="menuContentRef"
            :style="{ top: state.top + 'px', left: state.left + 'px', opacity: state.opacity }" :class="className">
            <slot ></slot>
        </div>
    </div>
</template>

<style>
.cura-context-menu-root {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    /* background-color: rgba(0, 128, 0, 0.449); */
}

.cura-context-menu-content {
    position: fixed;
    background-color: red;
    z-index: 100;
}
</style>
