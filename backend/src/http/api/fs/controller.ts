import {Context} from "hono";
import {respond} from "@lib/respond";
import {createEntry, getByPath, getFileByPath, getRoot} from "./service";
import {BadRequestError} from "@core/erorrs";
import {CreateEntrySchema} from "@http/api/fs/schema";

export const getRootController = async (c: Context) => {
  return respond(c, await getRoot())
}

export const getEntryController = async (c: Context) => {
  const path = c.req.param("path")
  const entryType = c.req.query("type") || "folder"
  console.log(entryType)
  if (!path) {
    throw new BadRequestError()
  }

  if (entryType !== "folder") {
    const data = await getFileByPath(path)
    return respond(c, data)
  }

  const data = await getByPath(path)
  return respond(c, data)
}

export const createEntryController = async (c: Context) => {
  const payload = await c.get("jwtPayload")
  const body = await c.req.json();
  const parsed = CreateEntrySchema.safeParse(body);
  if (!parsed.success) {
    console.log(parsed.error)
    throw new BadRequestError();
  }

  const user_id = payload.sub;

  const createdEntry = await createEntry(parsed.data, user_id);

  return respond(c, createdEntry);
};