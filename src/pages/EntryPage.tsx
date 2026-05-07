import { useState } from 'react'

import type { InventoryDraft, InventoryItem } from '../domain/inventory.js'
import { BulkImportPage } from './BulkImportPage.js'
import { ItemFormPage } from './ItemFormPage.js'

type EntryMode = 'single' | 'bulk'

export function EntryPage({
  editingItem,
  onSave,
  onBulkImport,
  onCancelEdit,
}: {
  editingItem?: InventoryItem
  onSave: (draft: InventoryDraft) => void
  onBulkImport: (drafts: InventoryDraft[]) => void
  onCancelEdit: () => void
}) {
  const [mode, setMode] = useState<EntryMode>('single')

  return (
    <main className="screen">
      <header className="screen-header compact">
        <h1>{editingItem ? '编辑物品' : '录入'}</h1>
        <p>{editingItem ? '修改单个库存项。' : '可以单个录入，也可以粘贴大模型生成的批量文本。'}</p>
      </header>

      {!editingItem ? (
        <div className="entry-tabs" role="tablist" aria-label="录入方式">
          <button type="button" role="tab" aria-selected={mode === 'single'} className={mode === 'single' ? 'active' : ''} onClick={() => setMode('single')}>
            单个录入
          </button>
          <button type="button" role="tab" aria-selected={mode === 'bulk'} className={mode === 'bulk' ? 'active' : ''} onClick={() => setMode('bulk')}>
            批量录入
          </button>
        </div>
      ) : null}

      {editingItem || mode === 'single' ? (
        <ItemFormPage key={editingItem?.id ?? 'new'} embedded editingItem={editingItem} onSave={onSave} onCancelEdit={onCancelEdit} />
      ) : (
        <BulkImportPage embedded onImport={onBulkImport} />
      )}
    </main>
  )
}
