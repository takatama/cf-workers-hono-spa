import { Hono } from 'hono'

type Bindings = {
  AI: any
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/translate', async (c) => {
  const formData = await c.req.formData()
  const prompt = formData.get('prompt')
  if (typeof prompt !== 'string') {
    return c.text('Invalid input', 400);
  }

  const messages = [
    {
      role: "system",
      content: `
  If the following text is in Japanese, translate it into English phrases without additional comments. If it is already in English, reply with the text exactly as it is.
  `,
    },
    { role: "user", content: prompt },
  ]

  const stream = await c.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
    messages,
    stream: true,
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    }
  })
})

export default app
