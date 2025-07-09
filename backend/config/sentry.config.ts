import * as Sentry from "@sentry/node"
import {envConfig} from "./env.config"


Sentry.init({
    dsn: envConfig.SENTRY_DSN,
    sendDefaultPii: true
})
