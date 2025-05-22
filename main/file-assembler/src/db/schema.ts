import { pgTable, serial, varchar, foreignKey, uuid, integer, timestamp, text, uniqueIndex, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const storageItemType = pgEnum("StorageItemType", ['FILE', 'FOLDER'])
export const storageItemUploadStatus = pgEnum("StorageItemUploadStatus", ['FINISHED', 'LOADING', 'INITIALIZED', 'ASSEMBLING'])


export const role = pgTable("Role", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const permission = pgTable("Permission", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const storageItem = pgTable("StorageItem", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	parentId: uuid(),
	name: varchar({ length: 255 }).notNull(),
	mimeType: varchar({ length: 255 }).notNull(),
	size: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }),
	type: storageItemType().notNull(),
	storagePath: text(),
	hash: text(),
	uploadStatus: storageItemUploadStatus().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "StorageItem_parentId_StorageItem_id_fk"
		}),
]);

export const storageItemUserRole = pgTable("StorageItemUserRole", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid().notNull(),
	userId: uuid().notNull(),
	roleId: serial().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.storageItemId],
			foreignColumns: [storageItem.id],
			name: "StorageItemUserRole_storageItemId_StorageItem_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "StorageItemUserRole_userId_User_id_fk"
		}),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "StorageItemUserRole_roleId_Role_id_fk"
		}),
]);

export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	uniqueIndex("user_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("user_username_key").using("btree", table.username.asc().nullsLast().op("text_ops")),
]);

export const uploadChunk = pgTable("UploadChunk", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid().notNull(),
	chunkNumber: integer().notNull(),
	chunkSize: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).defaultNow().notNull(),
	hash: varchar({ length: 300 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.storageItemId],
			foreignColumns: [storageItem.id],
			name: "UploadChunk_storageItemId_StorageItem_id_fk"
		}),
]);

export const rolePermission = pgTable("RolePermission", {
	roleId: serial().notNull(),
	permissionId: serial().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "RolePermission_roleId_Role_id_fk"
		}),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permission.id],
			name: "RolePermission_permissionId_Permission_id_fk"
		}),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "RolePermission_roleId_permissionId_pk"}),
]);
