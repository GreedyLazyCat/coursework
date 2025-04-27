<script setup lang="ts">

const { ready, loggedIn, user, session, fetch: refreshSession, clear: clearSession } = useUserSession()

const credentials = reactive({
    username: '',
    password: ''
})

async function login() {
    console.log('test')
    $fetch('/api/login', {
        method: 'POST',
        body: credentials
    })
        .then(async () => {
            // Refresh the session on client-side and redirect to the home page
            await refreshSession()
            console.log(session.value)
            console.log(user)
        })
        .catch(() => alert('Bad credentials'))
}

function test() {
    console.log(loggedIn.value)
    console.log(ready.value)
    console.log(user.value)
}

</script>

<template>
    <h1>Hello, world!</h1>
    <div v-if="!loggedIn">
        <form @submit.prevent="login">
            <input v-model="credentials.username" type="username" placeholder="username" />
            <input v-model="credentials.password" type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
    <div v-else>
        <button @click="clearSession()">logout</button>
    </div>
    <button @click="test">test</button>
    <NuxtLink to="/signup">signup</NuxtLink>
</template>

<style>
html,
body {
    padding: 0;
    margin: 0;
}
</style>