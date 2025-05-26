import { pgTable, serial, varchar, foreignKey, uuid, integer, timestamp, text, uniqueIndex, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const storageItemType = pgEnum("storage_item_type", ['FILE', 'FOLDER'])
export const storageItemUploadStatus = pgEnum("storage_item_upload_status", ['FINISHED', 'LOADING', 'INITIALIZED', 'ASSEMBLING'])


export const role = pgTable("role", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const permission = pgTable("permission", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const storageItem = pgTable("storage_item", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	parentId: uuid("parent_id"),
	name: varchar({ length: 255 }).notNull(),
	mimeType: varchar("mime_type", { length: 255 }).notNull(),
	size: integer().notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	type: storageItemType().notNull(),
	storagePath: text("storage_path"),
	hash: text(),
	uploadStatus: storageItemUploadStatus("upload_status").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "storage_item_parent_id_storage_item_id_fk"
		}),
]);

export const storageItemUserRole = pgTable("storage_item_user_role", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid("storage_item_id").notNull(),
	userId: uuid("user_id").notNull(),
	roleId: serial("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.storageItemId],
			foreignColumns: [storageItem.id],
			name: "storage_item_user_role_storage_item_id_storage_item_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "storage_item_user_role_user_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "storage_item_user_role_role_id_role_id_fk"
		}),
]);

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	uniqueIndex("user_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("user_username_key").using("btree", table.username.asc().nullsLast().op("text_ops")),
]);

export const uploadChunk = pgTable("upload_chunk", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid("storage_item_id").notNull(),
	chunkNumber: integer("chunk_number").notNull(),
	chunkSize: integer("chunk_size").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	hash: varchar({ length: 300 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.storageItemId],
			foreignColumns: [storageItem.id],
			name: "upload_chunk_storage_item_id_storage_item_id_fk"
		}),
]);

export const rolePermission = pgTable("role_permission", {
	roleId: serial("role_id").notNull(),
	permissionId: serial("permission_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "role_permission_role_id_role_id_fk"
		}),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permission.id],
			name: "role_permission_permission_id_permission_id_fk"
		}),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "role_permission_role_id_permission_id_pk"}),
]);
