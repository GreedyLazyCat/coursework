<script setup lang="ts">

const { to = '' } = defineProps<{ to: string }>()
const route = useRoute()

const isActive = computed(() => route.path === to)


function navigate() {
    console.log(to)
    console.log(route.path
    )
    navigateTo({
        path: to
    })
}

</script>

<template>
    <li class="cura-nav-item" @mouseup="navigate" :class="{ active: isActive }">
        <slot></slot>
    </li>
</template>

<style>
.cura-nav-item {
    padding: 8px 16px;
    border-radius: 8px;
    transition: background-color 0.3s;
    font-size: 16px;
    color: var(--md-sys-color-on-surface);
}

.cura-nav-item.active {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
}

.cura-nav-item:hover {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    cursor: pointer;
}
</style>