import { useRef, useState } from 'react'

import { downloadTextFile } from '../lib/photos.js'

export function SettingsPage({
  total,
  onExport,
  onImport,
  onClear,
}: {
  total: number
  onExport: () => string
  onImport: (text: string) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  return (
    <main className="screen">
      <header className="screen-header compact">
        <h1>设置</h1>
        <p>本地存储，记得偶尔导出一份备份。</p>
      </header>

      <section className="settings-list">
        <div className="settings-row">
          <div>
            <h2>导出备份</h2>
            <p>当前共有 {total} 条库存。</p>
          </div>
          <button
            type="button"
            onClick={() => {
              downloadTextFile(`home-inventory-${new Date().toISOString().slice(0, 10)}.json`, onExport())
              setMessage('备份文件已生成')
            }}
          >
            导出
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h2>导入备份</h2>
            <p>导入会替换当前浏览器里的库存。</p>
          </div>
          <input
            hidden
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              try {
                onImport(await file.text())
                setMessage('备份已导入')
              } catch (error) {
                setMessage(error instanceof Error ? error.message : '导入失败')
              }
            }}
          />
          <button type="button" className="secondary" onClick={() => inputRef.current?.click()}>
            导入
          </button>
        </div>

        <div className="settings-row">
          <div>
            <h2>清空数据</h2>
            <p>这个操作会清空本机浏览器里的库存。</p>
          </div>
          <button
            type="button"
            className="danger-button"
            onClick={() => {
              if (confirm('确认清空所有库存吗？')) {
                onClear()
                setMessage('库存已清空')
              }
            }}
          >
            清空
          </button>
        </div>
      </section>

      {message ? <p className="success-text">{message}</p> : null}
    </main>
  )
}
