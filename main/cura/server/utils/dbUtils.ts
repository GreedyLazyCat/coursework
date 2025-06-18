import { isNull, like } from "drizzle-orm";
import { NodePgClient } from "drizzle-orm/node-postgres";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { role } from "../db/schema";

type RawQueryItem = {
    id: string,
    parent_id: string
}
const db = useDrizzle()

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
    const rows = await getStorageItemParentsPath(storageItemId)
    for (const row of rows) {
        const result = await db.select().from(tables.storageItemUserRole)
            .leftJoin(tables.role, eq(tables.role.id, tables.storageItemUserRole.roleId))
            .leftJoin(tables.rolePermission, eq(tables.role.id, tables.rolePermission.roleId))
            .leftJoin(tables.permission, eq(tables.rolePermission.permissionId, tables.permission.id))
            .where(and(
                eq(tables.storageItemUserRole.storageItemId, row.id),
                eq(tables.storageItemUserRole.userId, userId),
            ))
        if (result.length !== 0) {
            const foundPermission = result.find((e) => (e.permission) ? e.permission.name === permission : false)
            return (foundPermission) ? true : false
        }
    }

}

export async function deleteStorageItem(storageItemId: string) {
    const selected = await db.select({ type: tables.storageItem.type })
        .from(tables.storageItem)
        .where(eq(tables.storageItem.id, storageItemId))
    const children = await getStorageItemChildrenPath(storageItemId)
    for (const child of children.reverse()) {
        const deletedChild = await db.delete(tables.storageItem)
            .where(eq(tables.storageItem.id, child.id)).returning()
    }

}

export async function createUserStorage(userId: string, username: string) {
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
export async function getStorageItemParentsPath(storageItemId: string) {
    const recursive = await db.execute<RawQueryItem>(
        sql`
              WITH RECURSIVE
        dir_path AS (
            SELECT
            item.id,
            item.parent_id,
            item.name
            FROM
            storage_item item
            WHERE
            item.id = ${storageItemId}
            UNION ALL
            SELECT
            s.id,
            s.parent_id,
            s.name
            FROM
            storage_item s
            JOIN dir_path ON s.id = dir_path.parent_id
        )
        SELECT
        *
        FROM
        dir_path
            `)
    if (recursive.rowCount === 0) {
        throw createError({
            message: `No storage item with id ${storageItemId}`
        })
    }
    return recursive.rows
}

export async function getStorageItemChildrenPath(storageItemId: string) {
    const recursive = await db.execute<RawQueryItem>(
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
            JOIN dir_path ON s.parent_id = dir_path.id
        )
        SELECT
        *
        FROM
        dir_path
            `)
    if (recursive.rowCount === 0) {
        throw createError({
            message: `No storage item with id ${storageItemId}`
        })
    }
    return recursive.rows
}

export async function getUserOwnedItem(userId: string, ownerRoleName: string) {

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

export async function getStorageItemChildren(storageItemId: string) {
    const result = await db.select().from(tables.storageItem)
        .where(and(
            eq(tables.storageItem.parentId, storageItemId),
            eq(tables.storageItem.uploadStatus, "FINISHED"),
        ))
    return result
}

export async function findItemBySubstring(whereToLookId: string, substr: string) {
    const result = await db.execute(sql`
        WITH RECURSIVE descendants AS (
            SELECT id, parent_id, name
            FROM storage_item 
            WHERE id = ${whereToLookId} 

            UNION ALL

            SELECT n.id, n.parent_id, n.name
            FROM storage_item n
            JOIN descendants d ON n.parent_id = d.id
        )
        SELECT * FROM descendants
        WHERE name ILIKE ${'%' + substr + '%'};  
        `)

    return result.rows.filter((value) => {
        return value.parent_id !== null
    })
}

export async function getRecentlyEdidetItems(rootId: string) {
    const result = await db.execute(sql`
  WITH RECURSIVE recent_descendants AS (
    SELECT *
    FROM storage_item
    WHERE id = ${rootId}

    UNION ALL

    SELECT s.*
    FROM storage_item s
    JOIN recent_descendants r ON s.parent_id = r.id
  )
  SELECT *
  FROM recent_descendants
  WHERE updated_at >= NOW() - INTERVAL '7 days'
  ORDER BY updated_at DESC;
`);
    return result.rows
}