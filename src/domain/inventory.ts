export type ExpiryKind = 'expired' | 'soon' | 'fresh' | 'missing'

export type InventoryItem = {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate?: string
  location?: string
  purchaseDate?: string
  openedDate?: string
  brand?: string
  photoDataUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type InventoryDraft = {
  name: string
  category: string
  quantity: number
  unit?: string
  expiryDate?: string
  location?: string
  purchaseDate?: string
  openedDate?: string
  brand?: string
  photoDataUrl?: string
  notes?: string
}

export const DEFAULT_CATEGORIES = [
  '护肤品',
  '彩妆',
  '厨房调料',
  '清洁用品',
  '药品',
  '食品',
  '其他',
] as const

export const DEFAULT_LOCATIONS = ['浴室柜', '梳妆台', '厨房上柜', '冰箱', '储物柜'] as const
export const DEFAULT_UNITS = ['件', '瓶', '盒', '袋', '包', '罐', '支', '个'] as const

export function createInventoryItem(draft: InventoryDraft, now = new Date()): InventoryItem {
  const timestamp = now.toISOString()

  return {
    ...draft,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: draft.name.trim(),
    category: draft.category.trim(),
    quantity: draft.quantity,
    unit: draft.unit?.trim() || '件',
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
