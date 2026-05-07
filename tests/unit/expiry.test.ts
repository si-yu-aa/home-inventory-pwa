import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getExpiryStatus, summarizeExpiry } from '../../src/domain/expiry.js'
import type { InventoryItem } from '../../src/domain/inventory.js'

const baseItem: InventoryItem = {
  id: 'item-1',
  name: '洗面奶',
  category: '护肤品',
  quantity: 1,
  unit: '瓶',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

describe('getExpiryStatus', () => {
  it('marks items without expiry dates as missing expiry', () => {
    assert.equal(getExpiryStatus(baseItem, new Date('2026-05-06T00:00:00Z')).kind, 'missing')
  })

  it('marks past expiry dates as expired', () => {
    const result = getExpiryStatus({ ...baseItem, expiryDate: '2026-05-05' }, new Date('2026-05-06T00:00:00Z'))

    assert.equal(result.kind, 'expired')
    assert.equal(result.daysUntilExpiry, -1)
  })

  it('marks dates within 30 days as soon', () => {
    const result = getExpiryStatus({ ...baseItem, expiryDate: '2026-05-30' }, new Date('2026-05-06T00:00:00Z'))

    assert.equal(result.kind, 'soon')
    assert.equal(result.daysUntilExpiry, 24)
  })

  it('marks dates after 30 days as fresh', () => {
    const result = getExpiryStatus({ ...baseItem, expiryDate: '2026-07-01' }, new Date('2026-05-06T00:00:00Z'))

    assert.equal(result.kind, 'fresh')
    assert.equal(result.daysUntilExpiry, 56)
  })
})

describe('summarizeExpiry', () => {
  it('groups inventory by expiry status', () => {
    const items: InventoryItem[] = [
      { ...baseItem, id: 'expired', expiryDate: '2026-05-01' },
      { ...baseItem, id: 'soon', expiryDate: '2026-05-20' },
      { ...baseItem, id: 'fresh', expiryDate: '2026-07-01' },
      { ...baseItem, id: 'missing' },
    ]

    const summary = summarizeExpiry(items, new Date('2026-05-06T00:00:00Z'))

    assert.deepEqual(
      {
        expired: summary.expired.map((item) => item.id),
        soon: summary.soon.map((item) => item.id),
        fresh: summary.fresh.map((item) => item.id),
        missing: summary.missing.map((item) => item.id),
      },
      {
        expired: ['expired'],
        soon: ['soon'],
        fresh: ['fresh'],
        missing: ['missing'],
      },
    )
  })
})
