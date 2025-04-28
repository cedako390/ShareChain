import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().default('secret'),
})

export const config = envSchema.parse(process.env)
