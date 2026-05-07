import type { InventoryDraft } from '../../domain/inventory.js'

export type BulkImportError = {
  line: number
  message: string
  raw: string
}

export type BulkImportResult = {
  items: InventoryDraft[]
  errors: BulkImportError[]
}

const HEADER_NAMES = new Set(['名称', '名字', 'name'])
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function parseBulkInventoryText(text: string): BulkImportResult {
  const items: InventoryDraft[] = []
  const errors: BulkImportError[] = []

  text
    .split(/\r?\n/)
    .map((raw, index) => ({ raw, line: index + 1 }))
    .filter(({ raw }) => raw.trim().length > 0)
    .forEach(({ raw, line }, visibleIndex) => {
      const cells = raw.split('|').map((cell) => cell.trim())

      if (visibleIndex === 0 && HEADER_NAMES.has(cells[0]?.toLowerCase())) {
        return
      }

      const [name = '', category = '', quantityText = '', unitText = '', expiryDateText = '', brand = '', notes = ''] = cells
      const rowErrors = validateRow({ name, category, quantityText, expiryDateText })

      if (rowErrors.length > 0) {
        errors.push(...rowErrors.map((message) => ({ line, message, raw })))
        return
      }

      items.push({
        name,
        category,
        quantity: Number(quantityText),
        unit: unitText || '件',
        expiryDate: expiryDateText || undefined,
        location: undefined,
        brand,
        notes,
      })
    })

  return { items, errors }
}

function validateRow({
  name,
  category,
  quantityText,
  expiryDateText,
}: {
  name: string
  category: string
  quantityText: string
  expiryDateText: string
}): string[] {
  if (!name) {
    return ['名称不能为空']
  }

  if (!category) {
    return ['分类不能为空']
  }

  const quantity = Number(quantityText)
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return ['数量必须是大于 0 的数字']
  }

  if (expiryDateText && !DATE_PATTERN.test(expiryDateText)) {
    return ['到期日必须使用 YYYY-MM-DD 格式']
  }

  return []
}
