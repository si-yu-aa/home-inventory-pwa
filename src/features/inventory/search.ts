import type { InventoryItem } from '../../domain/inventory.js'

const TERM_SEPARATOR = /[\s,，、;；|]+/

export function parseSearchTerms(query: string): string[] {
  const seen = new Set<string>()

  return query
    .split(TERM_SEPARATOR)
    .map((term) => term.trim().toLowerCase())
    .filter((term) => {
      if (!term || seen.has(term)) return false
      seen.add(term)
      return true
    })
}

export function filterInventoryBySearch(items: InventoryItem[], query: string): InventoryItem[] {
  const terms = parseSearchTerms(query)
  if (terms.length === 0) return items

  return items.filter((item) => {
    const text = getSearchableText(item)
    return terms.some((term) => text.includes(term))
  })
}

function getSearchableText(item: InventoryItem): string {
  return [
    item.name,
    item.category,
    item.location,
    item.brand,
    item.notes,
    item.expiryDate,
    item.purchaseDate,
    item.openedDate,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}
