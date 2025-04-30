import {db} from "@db/db";
import {entriesAccessTable, entriesTable} from "@db/schema";
import {and, eq, isNull, like} from "drizzle-orm";
import {ForbiddenError, NotFoundError} from "@core/erorrs";
import {minioClient} from "@db/minio";
import {generateDownloadUrl} from "@lib/minio";


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
  const url = await generateDownloadUrl("main", data[0].fullPath)
  return {
    ...data[0],
    downloadUrl: url,
  }
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

export async function createEntryWithUpload(data: any, user_id: number) {
  if (!data.parent_id) throw new ForbiddenError();

  // Проверка доступа
  const access = await db.select()
    .from(entriesAccessTable)
    .where(
      and(
        eq(entriesAccessTable.entryId, data.parent_id),
        eq(entriesAccessTable.userId, user_id)
      )
    ).limit(1);

  if (access.length === 0) throw new ForbiddenError();

  // Получение пути родителя
  const parent = await db.select({
    fullPath: entriesTable.fullPath,
  }).from(entriesTable).where(eq(entriesTable.id, data.parent_id)).limit(1);

  if (parent.length === 0) throw new NotFoundError();
  const fullPath = data.full_path;

  // Добавляем в базу (без файла в MinIO пока)
  const [inserted] = await db.insert(entriesTable).values({
    name: data.name,
    parentId: data.parent_id,
    isFolder: false,
    fullPath,
  }).returning({
    id: entriesTable.id,
    fullPath: entriesTable.fullPath,
  });

  // Генерация presigned PUT URL
  const presignedUrl = await minioClient.presignedPutObject('main', fullPath, 60 * 5);

  return {
    entryId: inserted.id,
    fullPath,
    fullPath,
    presignedUrl,
  }
}
