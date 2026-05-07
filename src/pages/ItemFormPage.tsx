import { useState } from 'react'

import { DEFAULT_CATEGORIES, DEFAULT_LOCATIONS, DEFAULT_UNITS, type InventoryDraft, type InventoryItem } from '../domain/inventory.js'
import { fileToResizedDataUrl } from '../lib/photos.js'

const EMPTY_DRAFT: InventoryDraft = {
  name: '',
  category: '护肤品',
  quantity: 1,
  unit: '件',
  expiryDate: undefined,
  location: '',
  purchaseDate: undefined,
  openedDate: undefined,
  brand: '',
  notes: '',
}

export function ItemFormPage({
  editingItem,
  onSave,
  onCancelEdit,
  embedded = false,
}: {
  editingItem?: InventoryItem
  onSave: (draft: InventoryDraft) => void
  onCancelEdit: () => void
  embedded?: boolean
}) {
  const [draft, setDraft] = useState<InventoryDraft>(() => (editingItem ? itemToDraft(editingItem) : EMPTY_DRAFT))
  const [photoError, setPhotoError] = useState('')

  const canSubmit = draft.name.trim() && draft.category.trim() && draft.quantity > 0

  const content = (
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault()
          if (!canSubmit) return
          onSave(normalizeDraft(draft))
          setDraft(EMPTY_DRAFT)
        }}
      >
        <section className="form-section">
          <h2>必须填写</h2>
          <label>
            名称
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="例如 洗面奶"
            />
          </label>
          <label>
            分类
            <input
              required
              list="category-options"
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value })}
            />
          </label>
          <datalist id="category-options">
            {DEFAULT_CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          <label>
            数量
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              value={draft.quantity}
              onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })}
            />
          </label>
          <label>
            单位
            <input
              required
              list="unit-options"
              value={draft.unit ?? '件'}
              onChange={(event) => setDraft({ ...draft, unit: event.target.value })}
              placeholder="例如 瓶"
            />
          </label>
          <datalist id="unit-options">
            {DEFAULT_UNITS.map((unit) => (
              <option key={unit} value={unit} />
            ))}
          </datalist>
        </section>

        <section className="form-section optional">
          <h2>选填信息</h2>
          <label>
            到期日
            <input type="date" value={draft.expiryDate ?? ''} onChange={(event) => setDraft({ ...draft, expiryDate: event.target.value || undefined })} />
          </label>
          <label>
            存放位置
            <input list="location-options" value={draft.location ?? ''} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="例如 浴室柜" />
          </label>
          <datalist id="location-options">
            {DEFAULT_LOCATIONS.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
          <label>
            购买日期
            <input type="date" value={draft.purchaseDate ?? ''} onChange={(event) => setDraft({ ...draft, purchaseDate: event.target.value || undefined })} />
          </label>
          <label>
            开封日期
            <input type="date" value={draft.openedDate ?? ''} onChange={(event) => setDraft({ ...draft, openedDate: event.target.value || undefined })} />
          </label>
          <label>
            品牌/规格
            <input value={draft.brand ?? ''} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} placeholder="例如 CeraVe 236ml" />
          </label>
          <label>
            照片
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                try {
                  setPhotoError('')
                  setDraft({ ...draft, photoDataUrl: await fileToResizedDataUrl(file) })
                } catch (error) {
                  setPhotoError(error instanceof Error ? error.message : '照片处理失败')
                }
              }}
            />
          </label>
          {draft.photoDataUrl ? <img src={draft.photoDataUrl} alt="" className="form-photo-preview" /> : null}
          {photoError ? <p className="error-text">{photoError}</p> : null}
          <label>
            备注
            <textarea value={draft.notes ?? ''} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="例如 已开封、想尽快用完" />
          </label>
        </section>

        <div className="form-actions">
          {editingItem ? (
            <button type="button" className="ghost" onClick={onCancelEdit}>
              取消编辑
            </button>
          ) : null}
          <button type="submit" disabled={!canSubmit}>
            {editingItem ? '保存修改' : '新增物品'}
          </button>
        </div>
      </form>
  )

  if (embedded) return content

  return (
    <main className="screen">
      <header className="screen-header compact">
        <h1>{editingItem ? '编辑物品' : '录入物品'}</h1>
        <p>必填项放在前面，到期日可以留空。</p>
      </header>
      {content}
    </main>
  )
}

function normalizeDraft(draft: InventoryDraft): InventoryDraft {
  return {
    ...draft,
    name: draft.name.trim(),
    category: draft.category.trim(),
    unit: draft.unit?.trim() || '件',
    location: draft.location?.trim() || undefined,
    brand: draft.brand?.trim() || undefined,
    notes: draft.notes?.trim() || undefined,
  }
}

function itemToDraft(item: InventoryItem): InventoryDraft {
  return {
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: item.expiryDate,
    location: item.location ?? '',
    purchaseDate: item.purchaseDate,
    openedDate: item.openedDate,
    brand: item.brand ?? '',
    photoDataUrl: item.photoDataUrl,
    notes: item.notes ?? '',
  }
}
