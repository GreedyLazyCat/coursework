<script setup lang="ts">
import '~/assets/css/main.css'
import '~/assets/css/dark.css'
import '~/assets/css/light.css'

const prefersDark = ref(false)

onMounted(() => {
    prefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
})

const theme = computed(() => prefersDark.value ? "dark" : "light")

</script>
<template>
    <div class="main-container" :class="theme">
        <div class="storage-main-container">
            <div>
                <div class="sidbar-top-items">
                    <div class="storage-cura-logo">
                        <span>Cura</span>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M14.738 19.9964C14.8186 19.9988 14.8994 20 14.9806 20C19.3989 20 22.9806 16.4183 22.9806 12C22.9806 7.58172 19.3989 4 14.9806 4C12.4542 4 10.2013 5.17108 8.73522 7H7.51941C3.92956 7 1.01941 9.91015 1.01941 13.5C1.01941 17.0899 3.92956 20 7.51941 20H14.5194C14.5926 20 14.6654 19.9988 14.738 19.9964ZM16.6913 17.721C19.0415 16.9522 20.9806 14.6815 20.9806 12C20.9806 8.68629 18.2943 6 14.9806 6C11.6669 6 8.98059 8.68629 8.98059 12H6.98059C6.98059 10.9391 7.1871 9.92643 7.56211 9H7.51941C5.03413 9 3.01941 11.0147 3.01941 13.5C3.01941 15.9853 5.03413 18 7.51941 18H14.5194C15.0691 18 15.9041 17.9014 16.6913 17.721Z"
                                fill="currentColor" />
                        </svg>
                    </div>
                    <hr>
                    <div class="storage-user-sidebar">
                        <div class="avatar"></div>
                        <div class="storage-user-info">
                            <span>Username</span>
                            <span>example@example.com</span>
                        </div>
                    </div>
                    <hr>
                    <CuraNav>
                        <CuraNavItem to="/home">Главная</CuraNavItem>
                        <CuraNavItem to="/mystorage">Мое хранилище</CuraNavItem>
                        <CuraNavItem to="/loadqueue">Очередь загрузки</CuraNavItem>
                    </CuraNav>
                </div>
                <div class="storage-sidebar-bottom-items">
                    <div class="loading-files-container">
                        <span>Загрузка файлов: 0/2</span>
                        <CuraProgress />
                        <button class="cura-btn" @click="navigateTo('/loadqueue')">
                            Подробнее
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style>
.storage-main-container {
    display: flex;
    /* flex-wrap: wrap; */
    gap: var(--s1);
    height: 100%;
    width: 100%;
}

.storage-main-container> :first-child {
    flex-grow: 1;
    flex-basis: 250px;
    border-right: 1px solid var(--md-sys-color-outline-variant);
    padding: 8px;
    gap: 8px;
    display: flex;
    flex-direction: column;
}

.sidbar-top-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.storage-sidebar-bottom-items {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    gap: 8px;
}

.storage-main-container> :last-child {
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 50%;
    position: relative;
}



.storage-main-container hr {
    margin: 0;
    border: none;
    border-top: 1px double var(--md-sys-color-outline-variant);
}

.storage-cura-logo {
    display: flex;
    align-items: center;
    color: var(--md-sys-color-primary);
    gap: 8px;
    font-size: 32px;
}

.avatar {
    height: 32px;
    width: 32px;
    background-color: var(--md-sys-color-on-surface);
    border-radius: 50%;
}

.storage-user-sidebar {
    display: flex;
    gap: 8px;
    align-items: center;
}

.storage-user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.storage-user-info> :first-child {
    color: var(--md-sys-color-on-surface);
    font-size: 16px;
}

.storage-user-info> :last-child {
    color: var(--md-sys-color-on-surface-variant);
    font-size: 12px;
}

.loading-files-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--md-sys-color-on-surface-variant);
    font-size: 14px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 8px;
    padding: 8px;
}



.cura-btn {
    border: 1px solid var(--md-sys-color-outline);
    padding: 8px 12px;
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-size: var(--input-font-size);
    border-radius: var(--input-border-radius);
}

.cura-btn:hover {
    cursor: pointer;
}

.loading-files-container .cura-btn {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    border: 1px solid var(--md-sys-color-outline-variant);
}


</style>