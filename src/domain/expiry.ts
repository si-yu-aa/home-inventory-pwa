import type { ExpiryKind, InventoryItem } from './inventory.js'

export type ExpiryStatus = {
  kind: ExpiryKind
  label: string
  daysUntilExpiry?: number
}

export type ExpirySummary = {
  expired: InventoryItem[]
  soon: InventoryItem[]
  fresh: InventoryItem[]
  missing: InventoryItem[]
}

const SOON_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

export function getExpiryStatus(item: InventoryItem, now = new Date()): ExpiryStatus {
  if (!item.expiryDate) {
    return { kind: 'missing', label: '无到期日' }
  }

  const today = startOfUtcDay(now)
  const expiry = parseDateAsUtcDay(item.expiryDate)
  const daysUntilExpiry = Math.round((expiry.getTime() - today.getTime()) / DAY_MS)

  if (daysUntilExpiry < 0) {
    return { kind: 'expired', label: `已过期 ${Math.abs(daysUntilExpiry)} 天`, daysUntilExpiry }
  }

  if (daysUntilExpiry <= SOON_DAYS) {
    return { kind: 'soon', label: `${daysUntilExpiry} 天后到期`, daysUntilExpiry }
  }

  return { kind: 'fresh', label: `${daysUntilExpiry} 天后到期`, daysUntilExpiry }
}

export function summarizeExpiry(items: InventoryItem[], now = new Date()): ExpirySummary {
  return items.reduce<ExpirySummary>(
    (summary, item) => {
      const status = getExpiryStatus(item, now)
      summary[status.kind].push(item)
      return summary
    },
    { expired: [], soon: [], fresh: [], missing: [] },
  )
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function parseDateAsUtcDay(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

