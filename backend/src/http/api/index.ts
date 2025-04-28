import {Hono} from "hono";
import {fsRouter} from "@http/api/fs";
import {authRouter} from "@http/api/auth";
import {jwtMiddleware} from "@http/middleware/jwt";

export const apiRouter = new Hono()
apiRouter.route("auth", authRouter)
apiRouter.use("/*", jwtMiddleware)
apiRouter.route("fs", fsRouter)