<script setup lang="ts">
const { clear } = useUserSession()

const { data, error } = await useFetch("/api/user/read")

async function logout() {
    await clear()
    await navigateTo('/login')
}


</script>

<template>
    <div class="page-main-container cura-user-page">
        <h1 class="cura-user-page__header">Данные пользователя</h1>
        <div class="user-data">
            <p class="user-data__text">
                Имя пользователя: {{ data?.username }}
            </p>
            <p class="user-data__text">
                Email: {{ data?.email }}
            </p>
        </div>
        <button class="cura-btn" @click="logout">
            Выйти
        </button>
    </div>
</template>

<style>
.cura-user-page {
    color: var(--md-sys-color-on-surface);
}

.cura-user-page__header {
    font-size: 24px;
    font-weight: 600;
    padding: 0;
    margin: 0;
}

.user-data__text {
    padding: 0;
    margin: 0;
}

.user-data{
    display: flex;
    gap: 8px;
    flex-direction: column;
}

</style>