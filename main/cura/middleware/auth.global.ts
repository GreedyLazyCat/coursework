
export default defineNuxtRouteMiddleware((to, from) =>{
    const {loggedIn} = useUserSession()
    const unauthorizedPaths = [
        '/login',
        '/signup'
    ] 
    if(!loggedIn.value && !unauthorizedPaths.includes(to.path)){
        return navigateTo('/login')
    }
})