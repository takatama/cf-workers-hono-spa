import { jwt, sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
const COOKIE_NAME = 'session'

type Bindings = {
  JWT_SECRET: string,
}

export const sessionMiddleware = () => createMiddleware<{ Bindings: Bindings }>((c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    cookie: COOKIE_NAME,
  })
  return jwtMiddleware(c, next)
})

export async function createSessionCookie(context:any, value: any, sessionSecret: string) {
  const payload = {
    ...value,
    // Turnstileの有効期限（5分）より、少しだけ長くする（6分）
    exp: Math.floor(Date.now() / 1000) + 60 * 6
  }
  const token = await sign(payload, sessionSecret)
  setCookie(context, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
  })
}
