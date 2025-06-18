<script setup lang="ts">
import { FetchError } from "ofetch";
const { fetch: refreshSession } = useUserSession()
definePageMeta(
    {
        layout: 'login-layout'
    }
)
const showPassword = ref(false)
const showRepeatPassword = ref(false)

const passwordIcon = computed(() => showPassword.value ? "material-symbols:visibility-off-outline" : "material-symbols:visibility-outline")
const repeatPasswordIcon = computed(() => showRepeatPassword.value ? "material-symbols:visibility-off-outline" : "material-symbols:visibility-outline")
const passwordInputType = computed(() => showPassword.value ? "text" : "password")
const repeatPasswordInputType = computed(() => showRepeatPassword.value ? "text" : "password")

const username = ref('')
const password = ref('')
const repeatPassword = ref('')
const email = ref('')

const usernameFeedback = ref('')
const passwordFeedback = ref('')
const repeatPasswordFeedback = ref('')
const emailFeedback = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const usernameHasError = computed(() => usernameFeedback.value !== '')
const passwordHasError = computed(() => passwordFeedback.value !== '')
const repeatPasswordHasError = computed(() => repeatPasswordFeedback.value !== '')
const emailHasError = computed(() => emailFeedback.value !== '')

const hasSuccess = computed(() => successMessage.value !== '')
const hasError = computed(() => errorMessage.value !== '')

function changeVisibility() {
    showPassword.value = !showPassword.value;
}

function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isFormNotValid() {
    let hasError = false
    if (username.value === '') {
        usernameFeedback.value = 'Поле логин должно быть заполненным'
        hasError = true
    }
    if (repeatPassword.value !== password.value) {
        errorMessage.value = "Пароли должны совпадать"
        hasError = true
    }
    if (password.value === '') {
        passwordFeedback.value = 'Поле пароль должно быть заполненным'
        hasError = true
    }
    if (repeatPassword.value === '') {
        repeatPasswordFeedback.value = 'Поле повторите пароль должно быть заполненным'
        hasError = true
    }
    if (!isValidEmail(email.value)) {
        emailFeedback.value = 'Неверный формат email'
        hasError = true
    }
    if (email.value === '') {
        emailFeedback.value = 'Поле email должно быть заполненным'
        hasError = true
    }
    return hasError
}

async function onSubmit() {
    if (isFormNotValid()) {
        return
    }
    try {
        await $fetch('/api/signup', {
            method: 'POST',
            body: {
                username: username.value,
                password: password.value,
                email: email.value
            }
        })
        errorMessage.value = ""
        successMessage.value = "Регистрация прошла успешно!"

    }
    catch (error: any) {
        if (error.data && error.data.statusMessage) {
            errorMessage.value = error.data.statusMessage
        } else {
            console.error('Неизвестная ошибка:', error)
        }
    }
}

watch(username, () => {
    usernameFeedback.value = ''
})
watch(password, () => {
    passwordFeedback.value = ''
})
watch(repeatPassword, () => {
    repeatPasswordFeedback.value = ''
})
watch(email, () => {
    emailFeedback.value = ''
})
</script>
<template>
    <div class="signup-main-container">
        <div class="signup-card">
            <div class="signup-title">
                <span>Cura</span>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14.738 19.9964C14.8186 19.9988 14.8994 20 14.9806 20C19.3989 20 22.9806 16.4183 22.9806 12C22.9806 7.58172 19.3989 4 14.9806 4C12.4542 4 10.2013 5.17108 8.73522 7H7.51941C3.92956 7 1.01941 9.91015 1.01941 13.5C1.01941 17.0899 3.92956 20 7.51941 20H14.5194C14.5926 20 14.6654 19.9988 14.738 19.9964ZM16.6913 17.721C19.0415 16.9522 20.9806 14.6815 20.9806 12C20.9806 8.68629 18.2943 6 14.9806 6C11.6669 6 8.98059 8.68629 8.98059 12H6.98059C6.98059 10.9391 7.1871 9.92643 7.56211 9H7.51941C5.03413 9 3.01941 11.0147 3.01941 13.5C3.01941 15.9853 5.03413 18 7.51941 18H14.5194C15.0691 18 15.9041 17.9014 16.6913 17.721Z"
                        fill="currentColor" />
                </svg>
            </div>
            <form action="" @submit.prevent="onSubmit">
                <div class="signup-form__info"
                    :class="{ 'signup-form__info--error': hasError, 'signup-form__info--success': hasSuccess }">
                    <span>{{ errorMessage || successMessage }}</span>
                </div>
                <CuraInput placeholder="Имя пользователя" name="password" type="text" v-model.trim="username"
                    :has-error="usernameHasError">
                    <template #leading>
                        <Icon name="material-symbols:account-circle-outline" style="font-size: 20px;"></Icon>
                    </template>
                    <template #feedback>
                        <div class="signup-form-item__feedback">
                            <span>{{ usernameFeedback }}</span>
                        </div>
                    </template>
                </CuraInput>
                <CuraInput placeholder="Email" name="password" type="email" v-model.trim="email"
                    :has-error="emailHasError">
                    <template #leading>
                        <Icon name="material-symbols:mail-outline" style="font-size: 20px;"></Icon>
                    </template>
                    <template #feedback>
                        <div class="signup-form-item__feedback">
                            <span>{{ emailFeedback }}</span>
                        </div>
                    </template>
                </CuraInput>
                <CuraInput placeholder="Пароль" name="password" :type="passwordInputType" v-model.trim="password"
                    :has-error="passwordHasError">
                    <template #leading>
                        <Icon name="material-symbols:lock" style="font-size: 20px;"></Icon>
                    </template>
                    <template #trailing>
                        <Icon :name="passwordIcon" @mouseup="changeVisibility" style="font-size: 20px;"
                            class="cura-input-show-password"></Icon>
                    </template>
                    <template #feedback>
                        <div class="signup-form-item__feedback">
                            <span>{{ passwordFeedback }}</span>
                        </div>
                    </template>
                </CuraInput>
                <CuraInput placeholder="Потворите пароль" name="password" :type="repeatPasswordInputType"
                    v-model.trim="repeatPassword" :has-error="repeatPasswordHasError">
                    <template #leading>
                        <Icon name="material-symbols:lock" style="font-size: 20px;"></Icon>
                    </template>
                    <template #trailing>
                        <Icon :name="repeatPasswordIcon" @mouseup="showRepeatPassword = !showRepeatPassword"
                            style="font-size: 20px;" class="cura-input-show-password"></Icon>
                    </template>
                    <template #feedback>
                        <div class="signup-form-item__feedback">
                            <span>{{ repeatPasswordFeedback }}</span>
                        </div>
                    </template>
                </CuraInput>
                <button class="signup-btn">Зарегистрироваться</button>
                <div class="signup_card__links">
                    <NuxtLink class="signup-card__link" to="/login">Вход</NuxtLink>
                </div>
            </form>
        </div>
    </div>
</template>
<style>
.cura-input-show-password:hover {
    cursor: pointer;
}

.signup-main-container {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--md-sys-color-on-surface);
}

.signup-center-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.signup-card {
    --border-angle: 0deg;
    --border-opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    /* z-index: 3; */
    background: linear-gradient(var(--md-sys-color-surface-container), var(--md-sys-color-surface-container-high), var(--md-sys-color-surface-container-highest));
    padding: 12px 16px;
    border-radius: 8px;
    outline: 1px solid var(--md-sys-color-outline-variant);
    width: 432px;
    justify-content: space-evenly;
    box-shadow: 4px 4px 12px 2px rgba(34, 60, 80, 0.09);
}

.signup-card::after {
    display: none;
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: var(--border-opacity);
    background: conic-gradient(from var(--border-angle), transparent 70%, var(--md-sys-color-primary));
    content: '';
    z-index: -1;
    border-radius: 10px;
    padding: 4px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.signup-card form {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 28px;
}

.signup-form-item__feedback {
    height: 20px;
    width: 100%;
    color: var(--md-sys-color-error);
    display: flex;
    align-items: center;
}

.signup-form-item__feedback span {
    font-size: 12px;
}


.signup-title span {
    font-size: 2.8rem;
    color: var(--md-sys-color-primary);
    margin-right: 24px;
}



.signup-btn {
    border: 1px solid var(--md-sys-color-outline);
    padding: 8px 12px;
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-size: var(--input-font-size);
    border-radius: var(--input-border-radius);
    height: 48px;
}

.signup-btn:hover {
    cursor: pointer;
}

.signup-title {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: center;
    color: var(--md-sys-color-primary);
    font-size: medium;
}

.signup-form__info {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 8px;

}

.signup-form__info--success {
    color: var(--md-sys-color-primary);
}

.signup-form__info--error {
    color: var(--md-sys-color-error);
}


.signup_card__links {
    display: flex;
    padding-top: 8px;
}

.signup-card__link {
    color: var(--md-sys-color-primary);
    cursor: pointer;
    text-decoration: none;
}

.signup-card__link:visited {
    color: var(--md-sys-color-secondary);
}
</style>