<script setup lang="ts">

const credentials = reactive({
    username: '',
    password: ''
})

async function signup() {
    console.log('test')
    $fetch('/api/signup', {
        method: 'POST',
        body: credentials
    })
}

</script>

<template>
    <h1>Hello, world!</h1>
        <form @submit.prevent="signup">
            <input v-model="credentials.username" type="username" placeholder="username" />
            <input v-model="credentials.password" type="password" placeholder="Password" />
            <button type="submit">Sign up</button>
        </form>
    
</template>

<style>

</style>