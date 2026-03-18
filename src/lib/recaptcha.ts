interface RecaptchaResult {
  success: boolean
  score?: number
  action?: string
  error?: string
}

export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY
  const minScore = parseFloat(import.meta.env.RECAPTCHA_MIN_SCORE || '0.5')

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not set — skipping verification')
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'reCAPTCHA token missing' }
  }

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${encodeURIComponent(token)}`,
  })

  const data = await res.json()

  if (!data.success) {
    return { success: false, error: 'reCAPTCHA verification failed', score: data.score }
  }

  if (typeof data.score === 'number' && data.score < minScore) {
    return { success: false, error: 'reCAPTCHA score too low', score: data.score }
  }

  return { success: true, score: data.score, action: data.action }
}
