import { useEffect, useMemo, useState } from 'react'

import type { InventoryDraft, InventoryItem } from '../../domain/inventory.js'
import {
  exportInventory,
  loadInventoryItems,
  makeInventoryItem,
  parseInventoryBackup,
  saveInventoryItems,
} from './storage.js'

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(() => loadInventoryItems())

  useEffect(() => {
    saveInventoryItems(items)
  }, [items])

  return useMemo(
    () => ({
      items,
      addItem(draft: InventoryDraft) {
        setItems((current) => [makeInventoryItem(draft), ...current])
      },
      addItems(drafts: InventoryDraft[]) {
        setItems((current) => [...drafts.map((draft) => makeInventoryItem(draft)), ...current])
      },
      updateItem(id: string, draft: InventoryDraft) {
        setItems((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...draft,
                  name: draft.name.trim(),
                  category: draft.category.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        )
      },
      deleteItem(id: string) {
        setItems((current) => current.filter((item) => item.id !== id))
      },
      clearItems() {
        setItems([])
      },
      exportJson() {
        return exportInventory(items)
      },
      importJson(text: string) {
        setItems(parseInventoryBackup(text))
      },
    }),
    [items],
  )
}

