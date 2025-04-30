<script setup lang="ts">
import '~/assets/css/main.css'
import '~/assets/css/dark.css'
import '~/assets/css/light.css'
import '~/assets/css/login.css'

const prefersDark = ref(false)

onMounted(() => {
    prefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
})

const theme = computed(() => prefersDark.value ? "dark" : "light")

</script>

<template>
    <div class="main-container" :class="theme">
        <slot />
    </div>
</template>