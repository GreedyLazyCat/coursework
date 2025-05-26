-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."storage_item_type" AS ENUM('FILE', 'FOLDER');--> statement-breakpoint
CREATE TYPE "public"."storage_item_upload_status" AS ENUM('FINISHED', 'LOADING', 'INITIALIZED', 'ASSEMBLING');--> statement-breakpoint
CREATE TABLE "role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3),
	"type" "storage_item_type" NOT NULL,
	"storage_path" text,
	"hash" text,
	"upload_status" "storage_item_upload_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_item_user_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"storage_item_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upload_chunk" (
	"id" serial PRIMARY KEY NOT NULL,
	"storage_item_id" uuid NOT NULL,
	"chunk_number" integer NOT NULL,
	"chunk_size" integer NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"hash" varchar(300) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permission" (
	"role_id" serial NOT NULL,
	"permission_id" serial NOT NULL,
	CONSTRAINT "role_permission_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "storage_item" ADD CONSTRAINT "storage_item_parent_id_storage_item_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."storage_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_item_user_role" ADD CONSTRAINT "storage_item_user_role_storage_item_id_storage_item_id_fk" FOREIGN KEY ("storage_item_id") REFERENCES "public"."storage_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_item_user_role" ADD CONSTRAINT "storage_item_user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_item_user_role" ADD CONSTRAINT "storage_item_user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upload_chunk" ADD CONSTRAINT "upload_chunk_storage_item_id_storage_item_id_fk" FOREIGN KEY ("storage_item_id") REFERENCES "public"."storage_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_key" ON "user" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_key" ON "user" USING btree ("username" text_ops);
*/