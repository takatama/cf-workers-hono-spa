import { Hono } from 'hono'
import translate from './translate'
import turnstile from './turnstile'
import { jwt } from 'hono/jwt'

type Bindings = {
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    cookie: 'session',
  })
  return jwtMiddleware(c, next)
})

app.route('/api/translate', translate)
app.route('/auth', turnstile)

export default app
