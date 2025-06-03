import { Static } from 'vue';
import { z } from 'zod'

export function numberValidator(val: string, ctx: z.RefinementCtx) {
    try {
        const parsed = Number.parseInt(String(val));
        return parsed;
    } catch (e) {
        ctx.addIssue({
            code: "custom",
            message: "Not a number",
        });
        return z.NEVER;
    }

}

export function paginateArray(array: Array<any>, page: number, itemsPerPage: number) {
    const start = itemsPerPage * (page - 1)
    if(start > array.length){
        return []
    }
    const end = Math.min(start + itemsPerPage, array.length)
    return array.slice(start, end)
}