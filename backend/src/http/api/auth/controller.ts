import {Context} from "hono";
import {LoginSchema} from "@http/api/auth/schema";
import {BadRequestError} from "@core/erorrs";
import {sign} from "hono/jwt";
import {authenticate} from "@http/api/auth/service";
import {config} from "@core/config";
import {setCookie} from "hono/cookie";
import { respond } from "@lib/respond";

export const loginController = async (c: Context) => {
    const body = await c.req.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
        throw new BadRequestError('Неверный формат логина или пароля')
    }

    const admin = await authenticate(parsed.data.email, parsed.data.password)

    const now = Math.floor(Date.now() / 1000)
    const oneDay = 60 * 60 * 24
    const access = await sign({ sub: admin.id, exp: now + oneDay }, config.JWT_SECRET)

    setCookie(c, 'token', access, {
        httpOnly: true,
        maxAge: oneDay,
        path: '/',
        secure: true,
        sameSite: 'None',
    })

    return respond(c, {})
}