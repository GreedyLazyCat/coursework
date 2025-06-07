import { pgTable, serial, text, integer, uniqueIndex, varchar, timestamp, pgEnum, uuid, type AnyPgColumn, primaryKey } from "drizzle-orm/pg-core"

export const storageItemType = pgEnum("storage_item_type", ['FILE', 'FOLDER'])
export const storageItemUploadStatus = pgEnum("storage_item_upload_status", ['FINISHED', 'LOADING', 'INITIALIZED', 'ASSEMBLING'])

export const rolePermission = pgTable("role_permission", {
	roleId: serial("role_id").references((): AnyPgColumn => role.id).notNull(),
	permissionId: serial("permission_id").references((): AnyPgColumn => permission.id).notNull(),
}, table => [
	primaryKey({ columns: [table.roleId, table.permissionId] })
]);

export const permission = pgTable("permission", {
	id: serial().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const storageItemUserRole = pgTable("storage_item_user_role", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid("storage_item_id").references((): AnyPgColumn => storageItem.id, { onDelete: 'cascade' }).notNull(),
	userId: uuid("user_id").references((): AnyPgColumn => user.id).notNull(),
	roleId: serial("role_id").references((): AnyPgColumn => role.id).notNull(),
});

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: varchar("username", { length: 255 }).notNull(),
	password: text().notNull(),
	email: varchar("email", { length: 255 }).notNull(),
},
	(table) => [
		uniqueIndex("user_username_key").on(table.username),
		uniqueIndex("user_email_key").on(table.email),
	]
);

export const uploadChunk = pgTable("upload_chunk", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid("storage_item_id").notNull().references((): AnyPgColumn => storageItem.id),
	chunkNumber: integer("chunk_number").notNull(),
	chunkSize: integer("chunk_size").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	hash: varchar("hash", { length: 300 }).notNull()
});

export const role = pgTable("role", {
	id: serial().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const storageItem = pgTable("storage_item", {
	id: uuid("id").primaryKey().defaultRandom(),
	parentId: uuid("parent_id").references((): AnyPgColumn => storageItem.id),
	name: varchar("name", { length: 255 }).notNull(),
	mimeType: varchar("mime_type", { length: 255 }).notNull(),
	size: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	type: storageItemType().notNull(),
	storagePath: text("storage_path").default(""),
	hash: text().default(""),
	uploadStatus: storageItemUploadStatus("upload_status").notNull(),
});
