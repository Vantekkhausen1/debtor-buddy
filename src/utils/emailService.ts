declare global {
  interface Window {
    emailjs: any;
  }
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

export interface EmailPayload {
  to_email: string;
  subject: string;
  message: string;
  az: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { success: false, error: 'EmailJS ist nicht konfiguriert. Bitte .env Variablen setzen (siehe SETUP.md).' }
  }

  try {
    if (!window.emailjs) {
      return { success: false, error: 'EmailJS SDK nicht geladen.' }
    }

    await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: payload.to_email,
      subject: payload.subject,
      message: payload.message,
      az: payload.az,
    }, PUBLIC_KEY)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error?.text || error?.message || 'Unbekannter Fehler beim E-Mail-Versand' }
  }
}

export function openMailClient(to: string, subject: string, body: string) {
  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = url
}
