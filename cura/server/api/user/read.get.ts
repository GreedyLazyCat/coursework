import { useRoute } from "vue-router"

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event)

    return { message: 'Hello, world!' }
})