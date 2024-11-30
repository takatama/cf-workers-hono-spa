import { Hono } from 'hono'
import translate from './translate'
import turnstile from './turnstile'

const app = new Hono()
app.route('/translate', translate)
app.route('/auth', turnstile)

export default app
