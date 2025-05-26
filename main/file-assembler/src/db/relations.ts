import { relations } from "drizzle-orm/relations";
import { storageItem, storageItemUserRole, user, role, uploadChunk, rolePermission, permission } from "./schema";

export const storageItemRelations = relations(storageItem, ({one, many}) => ({
	storageItem: one(storageItem, {
		fields: [storageItem.parentId],
		references: [storageItem.id],
		relationName: "storageItem_parentId_storageItem_id"
	}),
	storageItems: many(storageItem, {
		relationName: "storageItem_parentId_storageItem_id"
	}),
	storageItemUserRoles: many(storageItemUserRole),
	uploadChunks: many(uploadChunk),
}));

export const storageItemUserRoleRelations = relations(storageItemUserRole, ({one}) => ({
	storageItem: one(storageItem, {
		fields: [storageItemUserRole.storageItemId],
		references: [storageItem.id]
	}),
	user: one(user, {
		fields: [storageItemUserRole.userId],
		references: [user.id]
	}),
	role: one(role, {
		fields: [storageItemUserRole.roleId],
		references: [role.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	storageItemUserRoles: many(storageItemUserRole),
}));

export const roleRelations = relations(role, ({many}) => ({
	storageItemUserRoles: many(storageItemUserRole),
	rolePermissions: many(rolePermission),
}));

export const uploadChunkRelations = relations(uploadChunk, ({one}) => ({
	storageItem: one(storageItem, {
		fields: [uploadChunk.storageItemId],
		references: [storageItem.id]
	}),
}));

export const rolePermissionRelations = relations(rolePermission, ({one}) => ({
	role: one(role, {
		fields: [rolePermission.roleId],
		references: [role.id]
	}),
	permission: one(permission, {
		fields: [rolePermission.permissionId],
		references: [permission.id]
	}),
}));

export const permissionRelations = relations(permission, ({many}) => ({
	rolePermissions: many(rolePermission),
}));