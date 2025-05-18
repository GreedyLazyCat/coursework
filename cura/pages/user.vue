<script setup lang="ts">
const { clear } = useUserSession()
async function logout() {
    await clear()
    await navigateTo('/login')
}
</script>

<template>
    <div class="page-main-container">
        <button class="cura-btn">
            Выйти
        </button>
    </div>
</template>

<style>

</style>