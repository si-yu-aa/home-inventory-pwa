export type CopyResult = {
  ok: boolean
  method: 'clipboard' | 'fallback' | 'none'
}

type ClipboardLike = {
  writeText: (text: string) => Promise<void>
}

type TextareaLike = {
  value: string
  style: {
    position?: string
    top?: string
    left?: string
    opacity?: string
  }
  setAttribute: (name: string, value: string) => void
  focus: () => void
  select: () => void
  setSelectionRange: (start: number, end: number) => void
}

type ClipboardEnvironment = {
  isSecureContext?: boolean
  clipboard?: ClipboardLike
  document?: {
    createElement: (tag: 'textarea') => TextareaLike
    body: {
      appendChild: (node: TextareaLike) => unknown
      removeChild: (node: TextareaLike) => unknown
    }
    execCommand?: (command: 'copy') => boolean
  }
}

export async function copyText(text: string, environment: ClipboardEnvironment = getBrowserEnvironment()): Promise<CopyResult> {
  if (environment.isSecureContext && environment.clipboard) {
    try {
      await environment.clipboard.writeText(text)
      return { ok: true, method: 'clipboard' }
    } catch {
      return fallbackCopy(text, environment.document)
    }
  }

  return fallbackCopy(text, environment.document)
}

function fallbackCopy(text: string, documentRef: ClipboardEnvironment['document']): CopyResult {
  if (!documentRef?.execCommand) {
    return { ok: false, method: 'none' }
  }

  const textarea = documentRef.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'

  documentRef.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, text.length)

  const copied = documentRef.execCommand('copy')
  documentRef.body.removeChild(textarea)

  return { ok: copied, method: copied ? 'fallback' : 'none' }
}

function getBrowserEnvironment(): ClipboardEnvironment {
  return {
    isSecureContext: window.isSecureContext,
    clipboard: navigator.clipboard,
    document: document as unknown as ClipboardEnvironment['document'],
  }
}
