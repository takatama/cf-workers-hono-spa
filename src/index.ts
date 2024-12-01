import { Hono } from 'hono'
import translate from './translate'
import turnstile from './turnstile'
import { sessionMiddleware } from './session'
import { csrfMiddleware, secFetchSiteMiddleware } from './csrf'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

app.use('*', csrfMiddleware())
app.use('*', secFetchSiteMiddleware())
app.use('*', secureHeaders())
app.use('/public/*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://challenges.cloudflare.com"],
    frameSrc: ["https://challenges.cloudflare.com"],
    styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
    imgSrc: ["'self'", "blob:"],
  }
}))
app.use('/api/*', sessionMiddleware())

app.route('/auth', turnstile)
app.route('/api/translate', translate)

export default app
