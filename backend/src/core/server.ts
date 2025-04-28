import {Context, Hono} from "hono";
import {HttpError} from "./erorrs";
import {cors} from "hono/cors";
import {apiRouter} from "@http/api";
import {error} from "@lib/respond";


export async function createServer() {
    const app = new Hono()

    app.onError((err, c) => {
        if (err instanceof HttpError) {
            return error(c, err.code, err.message, undefined, err.status)
        }
        console.error('Unexpected Error', err)
        return error(c, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', undefined, 500)
    })


    app.use("*", cors({
        origin: ['http://localhost:3000'],
        credentials: true
    }))
    app.route('/api', apiRouter)

    app.get('/ping', (c: Context) => {
        return c.text('pong')
    })

    return app
}