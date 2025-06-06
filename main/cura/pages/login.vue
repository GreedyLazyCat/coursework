<script setup lang="ts">
const { fetch: refreshSession } = useUserSession()
definePageMeta(
    {
        layout: 'login-layout'
    }
)
const showPassword = ref(false)

const icon = computed(() => showPassword.value ? "material-symbols:visibility-off-outline" : "material-symbols:visibility-outline")
const inputType = computed(() => showPassword.value ? "text" : "password")

const username = ref('')
const password = ref('')

const usernameFeedback = ref('')
const passwordFeedback = ref('')
const errorMessage = ref('')

const usernameHasError = ref(false)
const passwordHasError = ref(false)

function changeVisibility() {
    showPassword.value = !showPassword.value;
}
async function onSubmit() {
    if (username.value === '') {
        usernameHasError.value = true
        usernameFeedback.value = 'Поле логин должно быть заполненным'
    }
    if (password.value === '') {
        passwordHasError.value = true
        passwordFeedback.value = 'Поле пароль должно быть заполненным'
    }
    if (passwordHasError.value || usernameHasError.value) {
        return
    }
    try {
        const data = await $fetch('/api/login',
            {
                method: 'POST',
                body: {
                    username: username.value, password: password.value
                }
            })
        await refreshSession()
        await navigateTo('/home')
    }
    catch (e) {
        console.log(e)
        errorMessage.value = 'Неверный логин или пароль'
    }
}

watch(username, () => {
    usernameHasError.value = false
    usernameFeedback.value = ''
})
watch(password, () => {
    passwordHasError.value = false
    passwordFeedback.value = ''
})
</script>
<template>
    <div class="login-main-container">
        <div class="login-card">
            <div class="login-card__title">
                <span>Cura</span>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.738 19.9964C14.8186 19.9988 14.8994 20 14.9806 20C19.3989 20 22.9806 16.4183 22.9806 12C22.9806 7.58172 19.3989 4 14.9806 4C12.4542 4 10.2013 5.17108 8.73522 7H7.51941C3.92956 7 1.01941 9.91015 1.01941 13.5C1.01941 17.0899 3.92956 20 7.51941 20H14.5194C14.5926 20 14.6654 19.9988 14.738 19.9964ZM16.6913 17.721C19.0415 16.9522 20.9806 14.6815 20.9806 12C20.9806 8.68629 18.2943 6 14.9806 6C11.6669 6 8.98059 8.68629 8.98059 12H6.98059C6.98059 10.9391 7.1871 9.92643 7.56211 9H7.51941C5.03413 9 3.01941 11.0147 3.01941 13.5C3.01941 15.9853 5.03413 18 7.51941 18H14.5194C15.0691 18 15.9041 17.9014 16.6913 17.721Z"
                        fill="currentColor" />
                </svg>
            </div>
            <form class="login-card__form" action="" @submit.prevent="onSubmit">
                <div class="login-card__error">
                    <span>{{ errorMessage }}</span>
                </div>
                <CuraInput placeholder="Имя пользователя" name="password" type="text" v-model.trim="username"
                    :has-error="usernameHasError">
                    <template #leading>
                        <Icon name="material-symbols:account-circle-outline" style="font-size: 20px;"></Icon>
                    </template>
                    <template #feedback>
                        <div class="login-form-item__feedback">
                            <span>{{ usernameFeedback }}</span>
                        </div>
                    </template>
                </CuraInput>
                <CuraInput placeholder="Пароль" name="password" :type="inputType" v-model.trim="password"
                    :has-error="passwordHasError">
                    <template #leading>
                        <Icon name="material-symbols:lock" style="font-size: 20px;"></Icon>
                    </template>
                    <template #trailing>
                        <Icon :name="icon" @mouseup="changeVisibility" style="font-size: 20px;"
                            class="cura-input-show-password"></Icon>
                    </template>
                    <template #feedback>
                        <div class="login-form-item__feedback">
                            <span>{{ passwordFeedback }}</span>
                        </div>
                    </template>
                </CuraInput>
                <button class="login-card__button">Войти</button>
                <div class="login-card__links">
                    <NuxtLink class="login-card__link" to="/signup">Зарегистрироваться</NuxtLink>
                    <a class="login-card__link">Забыли пароль?</a>
                </div>
            </form>

        </div>
    </div>
</template>
<style>
.cura-input-show-password:hover {
    cursor: pointer;
}
</style>