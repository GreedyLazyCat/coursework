<script setup lang="ts">
const {clear} = useUserSession()
async function logout(){
    await clear()
    await navigateTo('/login')
}
</script>

<template>
    <button @click="logout">Выйти</button>
</template>