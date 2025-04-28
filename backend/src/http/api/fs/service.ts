import {db} from "@db/db";
import {entriesAccessTable, entriesTable} from "@db/schema";
import {and, eq, isNull, like} from "drizzle-orm";
import {ForbiddenError, NotFoundError} from "@core/erorrs";


export async function getRoot() {
  return db.select({
    id: entriesTable.id,
    name: entriesTable.name,
    isFolder: entriesTable.isFolder,
    parentId: entriesTable.parentId,
    fullPath: entriesTable.fullPath,
  }).from(entriesTable).where(isNull(entriesTable.parentId));
}

export async function getByPath(path: string) {
  return db.select({
    id: entriesTable.id,
    name: entriesTable.name,
    isFolder: entriesTable.isFolder,
    parentId: entriesTable.parentId,
    fullPath: entriesTable.fullPath,
  }).from(entriesTable).where(like(entriesTable.fullPath, `${path}/%`))
}

export async function getFileByPath(path: string) {
  const data = await db.select({
    id: entriesTable.id,
    name: entriesTable.name,
    isFolder: entriesTable.isFolder,
    parentId: entriesTable.parentId,
    fullPath: entriesTable.fullPath,
  }).from(entriesTable).where(eq(entriesTable.fullPath, path)).limit(1)

  return data[0]
}

export async function createEntry(data: any, user_id: number) {
  if (!data.parent_id) {
    throw new ForbiddenError();
  }

  // Проверка доступа к родительской папке
  const access = await db.select()
    .from(entriesAccessTable)
    .where(
      and(
        eq(entriesAccessTable.entryId, data.parent_id),
        eq(entriesAccessTable.userId, user_id)
      )
    )
    .limit(1);

  if (access.length === 0) {
    throw new ForbiddenError();
  }

  // Получение полного пути родителя
  const parent = await db.select({
    fullPath: entriesTable.fullPath,
  }).from(entriesTable)
    .where(eq(entriesTable.id, data.parent_id))
    .limit(1);

  if (parent.length === 0) {
    throw new NotFoundError()
  }

  const [inserted] = await db.insert(entriesTable).values({
    name: data.name,
    parentId: data.parent_id,
    isFolder: data.is_folder,
    fullPath: data.full_path,
  }).returning({
    id: entriesTable.id,
    name: entriesTable.name,
    isFolder: entriesTable.isFolder,
    parentId: entriesTable.parentId,
    fullPath: entriesTable.fullPath,
  });

  return inserted;
}