import { Context } from 'hono'

type Meta = {
  page?: number
  limit?: number
  total?: number
}

type SuccessResponse<T> = {
  success: true
  data: T
  meta?: Meta
}

type ErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function respond<T>(c: Context, data: T, meta?: Meta, status = 200) {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {})
  }
  return c.json(body, status as any)
}

export function error(c: Context, code: string, message: string, details?: unknown, status = 400) {
  const body: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  }
  return c.json(body, status as any)
}
