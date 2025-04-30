<script setup lang="ts">
definePageMeta(
    {
        layout: 'login-layout'
    }
)

const showPassword = ref(false)

const icon = computed(() => showPassword.value ? "material-symbols:visibility-off-outline" : "material-symbols:visibility-outline")
const inputType = computed(() => showPassword.value ? "text" : "password")

function changeVisibility() {
    showPassword.value = !showPassword.value;
}

</script>
<template>
    <div class="login-main-container">
        <div class="login-center-group">
            <div class="login-card">
                <div class="login-title">
                    <span>Cura</span>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M14.738 19.9964C14.8186 19.9988 14.8994 20 14.9806 20C19.3989 20 22.9806 16.4183 22.9806 12C22.9806 7.58172 19.3989 4 14.9806 4C12.4542 4 10.2013 5.17108 8.73522 7H7.51941C3.92956 7 1.01941 9.91015 1.01941 13.5C1.01941 17.0899 3.92956 20 7.51941 20H14.5194C14.5926 20 14.6654 19.9988 14.738 19.9964ZM16.6913 17.721C19.0415 16.9522 20.9806 14.6815 20.9806 12C20.9806 8.68629 18.2943 6 14.9806 6C11.6669 6 8.98059 8.68629 8.98059 12H6.98059C6.98059 10.9391 7.1871 9.92643 7.56211 9H7.51941C5.03413 9 3.01941 11.0147 3.01941 13.5C3.01941 15.9853 5.03413 18 7.51941 18H14.5194C15.0691 18 15.9041 17.9014 16.6913 17.721Z"
                            fill="currentColor" />
                    </svg>
                </div>
                <form action="" @submit.prevent>
                    <CuraInput placeholder="Имя пользователя" name="password" type="text">
                        <template #leading>
                            <Icon name="material-symbols:account-circle-outline" style="font-size: 20px;"></Icon>
                        </template>
                    </CuraInput>
                    <div class="login-form-item__feedback"></div>
                    <CuraInput placeholder="Пароль" name="password" :type="inputType">
                        <template #leading>
                            <Icon name="material-symbols:lock" style="font-size: 20px;"></Icon>
                        </template>
                        <template #trailing>
                            <Icon :name="icon" @mouseup="changeVisibility" style="font-size: 20px;"
                                class="cura-input-show-password"></Icon>
                        </template>
                    </CuraInput>
                    <div class="login-form-item__feedback"></div>
                    <button class="login-btn" @mouseup="navigateTo({ path: '/home' })">Войти</button>
                </form>
            </div>
        </div>
    </div>
</template>
<style>
.cura-input-show-password:hover {
    cursor: pointer;
}
</style>