import { pgTable, serial, text, integer, uniqueIndex, varchar, timestamp, pgEnum, uuid, type AnyPgColumn, primaryKey } from "drizzle-orm/pg-core"

export const storageItemType = pgEnum("StorageItemType", ['FILE', 'FOLDER'])
export const storageItemUploadStatus = pgEnum("StorageItemUploadStatus", ['FINISHED', 'LOADING', 'INITIALIZED'])

export const rolePermission = pgTable("RolePermission", {
	roleId: serial("roleId").references((): AnyPgColumn => role.id).notNull(),
	permissionId: serial("permissionId").references((): AnyPgColumn => permission.id).notNull(),
}, table => [
	primaryKey({ columns: [table.roleId, table.permissionId] })
]);

export const permission = pgTable("Permission", {
	id: serial().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const storageItemUserRole = pgTable("StorageItemUserRole", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid("storageItemId").references((): AnyPgColumn => storageItem.id).notNull(),
	userId: uuid("userId").references((): AnyPgColumn => user.id).notNull(),
	roleId: serial("roleId").references((): AnyPgColumn => role.id).notNull(),
});

export const user = pgTable("User", {
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

export const uploadChunk = pgTable("UploadChunk", {
	id: serial().primaryKey().notNull(),
	storageItemId: uuid("storageItemId").notNull().references((): AnyPgColumn => storageItem.id),
	chunkNumber: integer().notNull(),
	chunkSize: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).defaultNow().notNull(),
	hash: varchar("hash", {length: 300}).notNull()
});

export const role = pgTable("Role", {
	id: serial().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const storageItem = pgTable("StorageItem", {
	id: uuid("id").primaryKey().defaultRandom(),
	parentId: uuid("parentId").references((): AnyPgColumn => storageItem.id),
	name: varchar("name", { length: 255 }).notNull(),
	mimeType: varchar("mimeType", { length: 255 }).notNull(),
	size: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }),
	type: storageItemType().notNull(),
	storagePath: text(),
	hash: text(),
	uploadStatus: storageItemUploadStatus().notNull(),
});
