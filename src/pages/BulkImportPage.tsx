import { useMemo, useState } from 'react'

import { DEFAULT_LOCATIONS, type InventoryDraft } from '../domain/inventory.js'
import { parseBulkInventoryText } from '../features/bulkImport/parser.js'
import { copyText } from '../lib/clipboard.js'
import { openDoubaoApp } from '../lib/externalApps.js'

const SAMPLE = `名称 | 分类 | 数量 | 单位 | 到期日 | 品牌规格 | 备注
洗面奶 | 护肤品 | 1 | 瓶 | 2026-11-30 | CeraVe 236ml | 已开封
生抽 | 厨房调料 | 2 | 瓶 | 2027-03-01 | 李锦记 |
散粉 | 彩妆 | 1 | 盒 |  | NARS | 无明确到期日`

const MODEL_PROMPT =
  '请根据照片识别家庭库存，并按格式输出：名称 | 分类 | 数量 | 单位 | 到期日 | 品牌规格 | 备注。不要在文本里写存放位置；存放位置会在 app 里统一填写。看不到到期日就留空。每行一个物品，不要输出多余解释。'

export function BulkImportPage({
  onImport,
  embedded = false,
}: {
  onImport: (drafts: InventoryDraft[]) => void
  embedded?: boolean
}) {
  const [text, setText] = useState('')
  const [batchLocation, setBatchLocation] = useState('')
  const [message, setMessage] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const parsed = useMemo(() => parseBulkInventoryText(text), [text])
  const canImport = parsed.items.length > 0 && parsed.errors.length === 0

  const content = (
    <>
      <section className="prompt-box">
        <div className="prompt-header">
          <h2>给大模型的提示词</h2>
          <button
            type="button"
            className="prompt-action"
            onClick={async () => {
              const result = await copyText(MODEL_PROMPT)
              setCopyMessage(result.ok ? '已复制，正在打开豆包' : '复制失败，正在尝试打开豆包')
              openDoubaoApp()
              window.setTimeout(() => {
                if (document.visibilityState === 'visible') {
                  setCopyMessage('如果豆包没有打开，请手动打开豆包并粘贴提示词')
                }
              }, 1500)
            }}
          >
            复制并打开豆包
          </button>
        </div>
        <p className="prompt-text">{MODEL_PROMPT}</p>
        {copyMessage ? <p className="success-text compact">{copyMessage}</p> : null}
      </section>

      <label className="batch-location-field">
        本批统一存放位置
        <input
          list="bulk-location-options"
          value={batchLocation}
          onChange={(event) => setBatchLocation(event.target.value)}
          placeholder="例如 厨房上柜，可留空"
        />
      </label>
      <datalist id="bulk-location-options">
        {DEFAULT_LOCATIONS.map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>

      <textarea
        className="bulk-textarea"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={SAMPLE}
      />

      <section className="preview-panel">
        <div className="section-title">
          <h2>导入预览</h2>
          <p>{parsed.items.length} 条可导入，{parsed.errors.length} 条需要修改。</p>
        </div>

        {parsed.errors.length > 0 ? (
          <div className="error-list">
            {parsed.errors.map((error) => (
              <p key={`${error.line}-${error.message}`}>
                第 {error.line} 行：{error.message}
              </p>
            ))}
          </div>
        ) : null}

        <div className="preview-list">
          {parsed.items.map((item, index) => (
            <div className="preview-row" key={`${item.name}-${index}`}>
              <strong>{item.name}</strong>
              <span>{item.category} · {item.quantity} {item.unit}</span>
              <span>
                {item.expiryDate ? `到期 ${item.expiryDate}` : '无到期日'}
                {batchLocation.trim() ? ` · ${batchLocation.trim()}` : ''}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="form-actions">
        <button
          type="button"
          disabled={!canImport}
          onClick={() => {
            const location = batchLocation.trim()
            onImport(parsed.items.map((item) => ({ ...item, location: location || undefined })))
            setMessage(`已导入 ${parsed.items.length} 条库存`)
          }}
        >
          确认导入
        </button>
      </div>
      {message ? <p className="success-text">{message}</p> : null}
    </>
  )

  if (embedded) return content

  return (
    <main className="screen">
      <header className="screen-header compact">
        <h1>批量录入</h1>
        <p>把大模型按格式输出的文本粘贴进来，先预览，再导入。</p>
      </header>
      {content}
    </main>
  )
}
