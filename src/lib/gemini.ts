import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY

if (!apiKey) {
  console.warn('Gemini API key is not configured. AI features will not work.')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export interface ChatOptions {
  model?: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

const defaultSystemPrompt = `Du bist ein hilfreicher Assistent auf einer Website.
Beantworte Fragen freundlich und professionell auf Deutsch.
Halte deine Antworten kurz und praezise.
Wenn du etwas nicht weisst, sage es ehrlich.`

export async function generateChatResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  options: ChatOptions = {}
) {
  if (!genAI) {
    throw new Error('Gemini API is not configured')
  }

  const {
    model = 'gemini-1.5-flash',
    systemPrompt = defaultSystemPrompt,
    temperature = 0.7,
    maxTokens = 1024,
  } = options

  const geminiModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
    systemInstruction: systemPrompt,
  })

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }))

  const chat = geminiModel.startChat({ history })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.content)

  return result.response.text()
}

export async function generateChatResponseStream(
  messages: { role: 'user' | 'assistant'; content: string }[],
  options: ChatOptions = {}
) {
  if (!genAI) {
    throw new Error('Gemini API is not configured')
  }

  const {
    model = 'gemini-1.5-flash',
    systemPrompt = defaultSystemPrompt,
    temperature = 0.7,
    maxTokens = 1024,
  } = options

  const geminiModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
    systemInstruction: systemPrompt,
  })

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }))

  const chat = geminiModel.startChat({ history })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessageStream(lastMessage.content)

  return result.stream
}
