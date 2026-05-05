import { NextRequest } from 'next/server'
import { z } from 'zod'
import { generateChatResponseStream } from '@/lib/gemini'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1),
  systemPrompt: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validierung
    const result = chatSchema.safeParse(body)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Validierungsfehler',
          details: result.error.flatten().fieldErrors
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages, systemPrompt } = result.data

    // Stream Response erstellen
    const stream = await generateChatResponseStream(messages, {
      systemPrompt,
    })

    // ReadableStream für Response erstellen
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)

    return new Response(
      JSON.stringify({
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
