CREATE TABLE "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_folder" boolean NOT NULL,
	"parent_id" integer,
	"full_path" text NOT NULL,
	"depth" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_entries_fullpath" ON "entries" USING btree ("full_path");--> statement-breakpoint
CREATE INDEX "idx_entries_depth" ON "entries" USING btree ("depth");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unique_name_in_parent" ON "entries" USING btree ("parent_id","name");