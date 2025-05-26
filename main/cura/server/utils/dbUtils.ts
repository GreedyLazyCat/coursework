import { isNull } from "drizzle-orm";
import { NodePgClient } from "drizzle-orm/node-postgres";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";

export async function storageItemById(db: NodePgDatabase<typeof import("../db/schema")> & {
    $client: NodePgClient;
}, id: string): Promise<typeof tables.storageItem.$inferSelect | undefined> {
    try {
        const storageItems = await db.select().from(tables.storageItem).where(eq(tables.storageItem.id, id))
        if (storageItems.length !== 0) {
            return storageItems[0]
        }
        return undefined
    }
    catch (e) {
        console.log(e)
        return undefined
    }
}

export async function storageItemExistsInFolder(
    db: NodePgDatabase<typeof import("../db/schema")> & { $client: NodePgClient; },
    name: string,
    mimeType: string,
    parentId: typeof tables.storageItem.parentId.dataType
): Promise<typeof tables.storageItem.$inferSelect | undefined> {

    try {
        const storageItems = await db.select()
            .from(tables.storageItem)
            .where(and(eq(tables.storageItem.name, name),
                eq(tables.storageItem.mimeType, mimeType),
                (parentId) ? eq(tables.storageItem.parentId, parentId) : isNull(tables.storageItem.parentId),
                eq(tables.storageItem.type, "FILE")
            ))
        console.log(parentId)
        if (storageItems.length !== 0) {
            return storageItems[0]
        }
        return undefined
    }
    catch (e) {
        console.log(e)
        return undefined
    }
}

export async function hasPermissionForStorageItem(userId: string, permission: string, storageItemId: string) {
    const db = useDrizzle()
    const result = await db.select().from(tables.storageItemUserRole)
        .leftJoin(tables.role, eq(tables.role.id, tables.storageItemUserRole.roleId))
        .leftJoin(tables.rolePermission, eq(tables.role.id, tables.rolePermission.roleId))
        .leftJoin(tables.permission, eq(tables.rolePermission.permissionId, tables.permission.id))
        .where(and(
            eq(tables.storageItemUserRole.storageItemId, storageItemId),
            eq(tables.storageItemUserRole.userId, userId),
        ))
    const found = result.find((value) => value.Permission?.name === permission)
    return found !== undefined
}