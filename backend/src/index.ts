import { createServer } from '@core/server'
import {config} from "@core/config";

const app = await createServer()

export default {
  port: config.PORT,
  fetch: app.fetch,
}
