import { AI_MODEL } from '@/lib/site'

// One place for the Groq call. gpt-oss-120b is a reasoning model and its hidden
// reasoning counts against max_tokens, so effort stays low and the budget leaves
// room for the JSON answer. Only the final message content is read.

export class AIError extends Error {
  status: number
  constructor(message: string, status = 502) {
    super(message)
    this.status = status
  }
}

function extractJSON(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  const objMatch = raw.match(/\{[\s\S]*\}/)
  if (objMatch) return objMatch[0]
  return raw.trim()
}

export async function groqJSON<T>(system: string, user: string, maxTokens = 1500): Promise<T> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new AIError('AI analysis is not configured on this deployment.', 503)

  let response: Response
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.2,
        max_tokens: maxTokens,
        reasoning_effort: 'low',
      }),
      signal: AbortSignal.timeout(25_000),
    })
  } catch (err) {
    console.error('[ai] Groq request failed:', err)
    throw new AIError('The AI service did not answer in time. Try again.', 504)
  }

  if (!response.ok) {
    const body = await response.text()
    console.error('[ai] Groq error:', response.status, body.slice(0, 300))
    if (response.status === 429) throw new AIError('The AI service is rate limited right now. Try again in a minute.', 429)
    throw new AIError(`The AI service returned an error (HTTP ${response.status}).`, 502)
  }

  const data = await response.json()
  const choice = data.choices?.[0]
  const raw: string = choice?.message?.content || ''
  if (!raw.trim()) {
    console.error('[ai] Empty content, finish_reason:', choice?.finish_reason)
    throw new AIError('The model ran out of room before answering. Try again.', 502)
  }

  try {
    return JSON.parse(extractJSON(raw)) as T
  } catch {
    console.error('[ai] Could not parse model output:', raw.slice(0, 300))
    throw new AIError("Couldn't read the model's answer. Try again.", 502)
  }
}
