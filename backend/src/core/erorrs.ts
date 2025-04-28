export class HttpError extends Error {
    status: number
    code: string

    constructor(message: string, status: number = 500, code: string = 'INTERNAL_SERVER_ERROR') {
        super(message)
        this.status = status
        this.code = code
    }
}

// 400 — Неверный запрос
export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(message, 400, 'BAD_REQUEST')
    }
}

// 401 — Неавторизован
export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED')
    }
}

// 403 — Доступ запрещён
export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN')
    }
}

// 404 — Не найдено
export class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
        super(message, 404, 'NOT_FOUND')
    }
}

// 409 — Конфликт, например, дубликат
export class ConflictError extends HttpError {
    constructor(message = 'Conflict') {
        super(message, 409, 'CONFLICT')
    }
}

// 422 — Ошибка валидации
export class ValidationError extends HttpError {
    constructor(message = 'Unprocessable Entity') {
        super(message, 422, 'VALIDATION_ERROR')
    }
}

// 429 — Слишком много запросов
export class TooManyRequestsError extends HttpError {
    constructor(message = 'Too Many Requests') {
        super(message, 429, 'TOO_MANY_REQUESTS')
    }
}

// 500 — Внутренняя ошибка
export class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error') {
        super(message, 500, 'INTERNAL_SERVER_ERROR')
    }
}
