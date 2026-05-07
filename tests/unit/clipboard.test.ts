import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { copyText } from '../../src/lib/clipboard.js'

function makeFakeDocument({ execResult }: { execResult: boolean }) {
  const appended: unknown[] = []
  const removed: unknown[] = []
  const textarea = {
    value: '',
    style: {} as Record<string, string>,
    readOnly: false,
    setAttribute(name: string, value: string) {
      textarea[name as 'readOnly'] = value === 'true'
    },
    focus() {
      textarea.focused = true
    },
    select() {
      textarea.selected = true
    },
    setSelectionRange(start: number, end: number) {
      textarea.selection = [start, end]
    },
    focused: false,
    selected: false,
    selection: [] as number[],
  }

  return {
    textarea,
    appended,
    removed,
    document: {
      createElement(tag: string) {
        assert.equal(tag, 'textarea')
        return textarea
      },
      body: {
        appendChild(node: unknown) {
          appended.push(node)
        },
        removeChild(node: unknown) {
          removed.push(node)
        },
      },
      execCommand(command: string) {
        assert.equal(command, 'copy')
        return execResult
      },
    },
  }
}

describe('copyText', () => {
  it('uses the async clipboard API in secure contexts', async () => {
    const writes: string[] = []
    const result = await copyText('hello', {
      isSecureContext: true,
      clipboard: {
        async writeText(text: string) {
          writes.push(text)
        },
      },
    })

    assert.deepEqual(writes, ['hello'])
    assert.deepEqual(result, { ok: true, method: 'clipboard' })
  })

  it('falls back to textarea selection when async clipboard is unavailable', async () => {
    const fake = makeFakeDocument({ execResult: true })
    const result = await copyText('手机复制文本', {
      isSecureContext: false,
      document: fake.document,
    })

    assert.equal(fake.textarea.value, '手机复制文本')
    assert.equal(fake.textarea.selected, true)
    assert.deepEqual(fake.textarea.selection, [0, '手机复制文本'.length])
    assert.equal(fake.appended.length, 1)
    assert.equal(fake.removed.length, 1)
    assert.deepEqual(result, { ok: true, method: 'fallback' })
  })
})
