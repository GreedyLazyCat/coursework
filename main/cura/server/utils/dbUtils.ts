import { isNull } from "drizzle-orm";
import { NodePgClient } from "drizzle-orm/node-postgres";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { role } from "../db/schema";

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
    if (result.length !== 0) {
        const found = result.find((value) => value.permission?.name === permission)
        return found !== undefined
    }
    else {
        const recursive = await db.execute(
            sql`
              WITH RECURSIVE
  dir_path AS (
    SELECT
      item.id,
      item.parent_id
    FROM
      storage_item item
    WHERE
      item.id = ${storageItemId}
    UNION ALL
    SELECT
      s.id,
      s.parent_id
    FROM
      storage_item s
      JOIN dir_path ON s.id = dir_path.parent_id
  )
SELECT
  ROW_NUMBER() OVER () AS row_number,
  *
FROM
  dir_path
  JOIN storage_item_user_role si ON dir_path.id = si.storage_item_id
  JOIN "role" r ON si.role_id = r.id
  JOIN role_permission rp ON rp.role_id = r.id
  JOIN "permission" p ON p.id = rp.permission_id 
            `)
        console.log(recursive.rows)
    }
}

export async function createUserStorage(userId: string, username: string) {
    const db = useDrizzle()
    const inserts = await db.insert(tables.storageItem).values({
        name: `${username}_storage`,
        mimeType: "none",
        size: 0,
        type: "FOLDER",
        uploadStatus: "FINISHED",
    }).returning({
        id: tables.storageItem.id
    })

    const roles = await db.select({ id: tables.role.id })
        .from(tables.role)
        .where(eq(tables.role.name, "owner"))

    await db.insert(tables.storageItemUserRole).values({
        storageItemId: inserts[0].id,
        userId: userId,
        roleId: roles[0].id
    })
}

export async function getUserOwnedItem(userId: string, ownerRoleName: string) {
    const db = useDrizzle()

    const query = await db.select().from(tables.storageItemUserRole)
        .leftJoin(tables.role, eq(tables.role.id, tables.storageItemUserRole.roleId))
        .where(eq(tables.storageItemUserRole.userId, userId))
    if (query.length === 0) {
        throw new Error("Error getting user owned item")
    }
    const result = query.find((item) => item.role?.name === ownerRoleName)
    if (!result) {
        throw new Error("Error getting user owned item")
    }


    return result.storage_item_user_role.storageItemId
}