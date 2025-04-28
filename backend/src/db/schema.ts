import {boolean, index, integer, pgTable, serial, text, uniqueIndex, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email").notNull(),
    password: varchar("password").notNull(),
});

export const entriesTable = pgTable("entries", {
    id: serial("id").primaryKey(),                 // Уникальный идентификатор
    name: text("name").notNull(),                   // Имя файла/папки (например 'foo', 'bar', 'some.docx')
    isFolder: boolean("is_folder").notNull(),       // true = папка, false = файл
    parentId: integer("parent_id"),                 // ID родителя (nullable)
    fullPath: text("full_path").notNull(),           // Полный путь к файлу/папке ('foo/bar/some.docx')
}, (table) => {
    return {
        fullPathIndex: index("idx_entries_fullpath").on(table.fullPath),
        uniqueInParent: uniqueIndex("idx_unique_name_in_parent").on(table.parentId, table.name),
    }
});

export const entriesRelations = relations(entriesTable, ({ one }) => ({
    invitee: one(entriesTable, {
        fields: [entriesTable.parentId],
        references: [entriesTable.id],
    }),
}));

export const entriesAccessTable = pgTable("entries_access", {
    id: serial("id").primaryKey(),
    entryId: integer("entry_id").notNull(),
    userId: integer("user_id").notNull(),
});

export const entriesAccessRelations = relations(entriesAccessTable, ({ one }) => ({
    entry: one(entriesTable, {
        fields: [entriesAccessTable.entryId],
        references: [entriesTable.id],
    }),
    user: one(usersTable, {
        fields: [entriesAccessTable.userId],
        references: [usersTable.id],
    }),
}));
