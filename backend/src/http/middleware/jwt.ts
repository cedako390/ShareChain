import { Context, MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'
import { config } from '@core/config'
import { getCookie } from 'hono/cookie'

export const jwtMiddleware: MiddlewareHandler = async (c: Context, next) => {
  const token = getCookie(c, 'token')

  if (!token) {
    return c.json({ message: 'Unauthorized' }, 403)
  }

  try {
    const payload = await verify(token, config.JWT_SECRET)
    c.set('jwtPayload', payload)
    await next()
  } catch (e) {
    console.error('JWT verification failed:', e)
    return c.json({ message: 'Forbidden' }, 403)
  }
}
