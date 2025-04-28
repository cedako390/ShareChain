import {Hono} from "hono";
import {createEntryController, getEntryController, getRootController} from "@http/api/fs/controller";


export const fsRouter = new Hono()

fsRouter.get("/", getRootController)
fsRouter.get("/:path{.+}", getEntryController)
fsRouter.post("/", createEntryController)