import { createInventoryItem, type InventoryDraft, type InventoryItem } from '../../domain/inventory.js'

const STORAGE_KEY = 'home-inventory.items.v1'

export function loadInventoryItems(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isInventoryItem).map(withInventoryDefaults)
  } catch {
    return []
  }
}

export function saveInventoryItems(items: InventoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function makeInventoryItem(draft: InventoryDraft): InventoryItem {
  return createInventoryItem(draft)
}

export function exportInventory(items: InventoryItem[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: 1,
      items,
    },
    null,
    2,
  )
}

export function parseInventoryBackup(text: string): InventoryItem[] {
  const parsed = JSON.parse(text)
  const maybeItems = Array.isArray(parsed) ? parsed : parsed.items

  if (!Array.isArray(maybeItems)) {
    throw new Error('备份文件里没有库存列表')
  }

  const items = maybeItems.filter(isInventoryItem)
  if (items.length !== maybeItems.length) {
    throw new Error('备份文件包含无法识别的库存项')
  }

  return items
}

function isInventoryItem(value: unknown): value is InventoryItem {
  if (!value || typeof value !== 'object') return false

  const item = value as InventoryItem
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.category === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.createdAt === 'string' &&
    typeof item.updatedAt === 'string'
  )
}

function withInventoryDefaults(item: InventoryItem): InventoryItem {
  return {
    ...item,
    unit: typeof item.unit === 'string' && item.unit.trim() ? item.unit : '件',
  }
}
