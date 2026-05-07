import { useMemo, useState } from 'react'

import { getExpiryStatus } from '../domain/expiry.js'
import { DEFAULT_CATEGORIES, type ExpiryKind, type InventoryItem } from '../domain/inventory.js'
import { ItemCard } from '../components/ItemCard.js'
import { filterInventoryBySearch } from '../features/inventory/search.js'
import { buildSearchExpansionPrompt } from '../features/inventory/searchPrompt.js'
import { copyText } from '../lib/clipboard.js'
import { openDoubaoApp } from '../lib/externalApps.js'

const STATUS_FILTERS: Array<{ value: 'all' | ExpiryKind; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'expired', label: '已过期' },
  { value: 'soon', label: '快到期' },
  { value: 'missing', label: '无到期日' },
]

export function InventoryPage({
  items,
  onEdit,
  onDelete,
}: {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<'all' | ExpiryKind>('all')
  const [promptMessage, setPromptMessage] = useState('')
  const canExpandSearch = query.trim().length > 0

  const filteredItems = useMemo(
    () =>
      filterInventoryBySearch(items, query).filter((item) => {
        const matchesCategory = category === 'all' || item.category === category
        const matchesStatus = status === 'all' || getExpiryStatus(item).kind === status
        return matchesCategory && matchesStatus
      }),
    [category, items, query, status],
  )

  return (
    <main className="screen">
      <header className="screen-header compact">
        <h1>库存</h1>
        <p>买东西前搜一下，少买重复的。</p>
      </header>

      <section className="toolbar">
        <div className="search-with-action">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="粉底 生抽 洁面" />
          <button
            type="button"
            disabled={!canExpandSearch}
            onClick={async () => {
              const result = await copyText(buildSearchExpansionPrompt(query))
              setPromptMessage(result.ok ? '已复制扩写 prompt，正在打开豆包' : '复制失败，正在尝试打开豆包')
              openDoubaoApp()
              window.setTimeout(() => {
                if (document.visibilityState === 'visible') {
                  setPromptMessage('如果豆包没有打开，请手动打开豆包并粘贴 prompt')
                }
              }, 1500)
            }}
          >
            扩写
          </button>
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">全部分类</option>
          {DEFAULT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as 'all' | ExpiryKind)}>
          {STATUS_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </section>
      {promptMessage ? <p className="success-text compact">{promptMessage}</p> : null}

      <section className="item-list">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
        ))}
        {filteredItems.length === 0 ? <p className="empty-state">没有找到匹配的库存。</p> : null}
      </section>
    </main>
  )
}
