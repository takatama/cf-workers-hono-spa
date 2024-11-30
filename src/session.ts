import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'

export async function createSessionCookie(context:any, value: any, sessionSecret: string) {
  const payload = {
    ...value,
    // Turnstileの有効期限（5分）より、少しだけ長くする（6分）
    exp: Math.floor(Date.now() / 1000) + 60 * 6
  }
  const token = await sign(payload, sessionSecret)
  setCookie(context, 'session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
  })
}
