import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { buildSearchExpansionPrompt } from '../../src/features/inventory/searchPrompt.js'

describe('buildSearchExpansionPrompt', () => {
  it('builds a prompt that asks for one-line space separated search terms', () => {
    const prompt = buildSearchExpansionPrompt('  粉底  ')

    assert.match(prompt, /「粉底」/)
    assert.match(prompt, /只输出一行搜索关键词/)
    assert.match(prompt, /用空格分隔/)
  })
})
