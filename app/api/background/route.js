const cache = new Map()

export async function POST(request) {
  try {
    const body = await request.json()
    const { storyId, chapterId, title, description, keywords } = body || {}

    const cacheKey = `${storyId || 'story'}-${chapterId || 'chapter'}`
    if (cache.has(cacheKey)) {
      return Response.json({ url: cache.get(cacheKey) })
    }

    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-1.5-flash'
    if (!apiKey) {
      return Response.json({ url: null }, { status: 200 })
    }

    const prompt = [
      'Create a soft, cozy, magical background illustration for a visual novel.',
      'No characters, no text, gentle light, warm palette, subtle texture.',
      title ? `Chapter title: ${title}.` : '',
      description ? `Story: ${description}.` : '',
      keywords ? `Keywords: ${keywords}.` : ''
    ].filter(Boolean).join(' ')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['IMAGE']
          }
        })
      }
    )

    if (!response.ok) {
      return Response.json({ url: null }, { status: 200 })
    }

    const data = await response.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    const imagePart = parts.find((part) => part?.inlineData?.data)
    if (!imagePart) {
      return Response.json({ url: null }, { status: 200 })
    }

    const mimeType = imagePart.inlineData.mimeType || 'image/png'
    const url = `data:${mimeType};base64,${imagePart.inlineData.data}`
    cache.set(cacheKey, url)
    return Response.json({ url })
  } catch (error) {
    return Response.json({ url: null }, { status: 200 })
  }
}
