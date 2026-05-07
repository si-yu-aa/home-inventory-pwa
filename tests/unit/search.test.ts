import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { InventoryItem } from '../../src/domain/inventory.js'
import { filterInventoryBySearch, parseSearchTerms } from '../../src/features/inventory/search.js'

const baseItem: InventoryItem = {
  id: 'base',
  name: '洗面奶',
  category: '护肤品',
  quantity: 1,
  unit: '瓶',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

describe('parseSearchTerms', () => {
  it('splits search input by spaces, punctuation, and new lines', () => {
    assert.deepEqual(parseSearchTerms('粉底, 气垫、隔离\n妆前乳'), ['粉底', '气垫', '隔离', '妆前乳'])
  })

  it('deduplicates terms and ignores blanks', () => {
    assert.deepEqual(parseSearchTerms('  酱油  生抽，酱油,,  '), ['酱油', '生抽'])
  })
})

describe('filterInventoryBySearch', () => {
  const items: InventoryItem[] = [
    { ...baseItem, id: 'cleanser', name: '氨基酸洁面乳', category: '护肤品', location: '浴室柜' },
    { ...baseItem, id: 'soy', name: '薄盐生抽', category: '厨房调料', brand: '李锦记' },
    { ...baseItem, id: 'powder', name: '柔焦蜜粉', category: '彩妆', notes: '定妆散粉替代' },
  ]

  it('returns all items when the query has no usable terms', () => {
    assert.deepEqual(filterInventoryBySearch(items, '   ').map((item) => item.id), ['cleanser', 'soy', 'powder'])
  })

  it('matches if any search term hits searchable item text', () => {
    assert.deepEqual(filterInventoryBySearch(items, '酱油 洁面 气垫').map((item) => item.id), ['cleanser'])
    assert.deepEqual(filterInventoryBySearch(items, '酱油 生抽').map((item) => item.id), ['soy'])
    assert.deepEqual(filterInventoryBySearch(items, '粉底 散粉').map((item) => item.id), ['powder'])
  })

  it('matches case-insensitive Latin brand text', () => {
    assert.deepEqual(filterInventoryBySearch(items, 'lee 锦记').map((item) => item.id), ['soy'])
  })
})
