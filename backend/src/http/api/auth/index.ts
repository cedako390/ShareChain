import {Hono} from "hono";
import {loginController} from "@http/api/auth/controller";

export const authRouter = new Hono()
authRouter.post('/login', loginController)