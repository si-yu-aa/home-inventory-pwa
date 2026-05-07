import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parseBulkInventoryText } from '../../src/features/bulkImport/parser.js'

describe('parseBulkInventoryText', () => {
  it('parses pipe-delimited rows without per-row locations', () => {
    const result = parseBulkInventoryText(`
名称 | 分类 | 数量 | 单位 | 到期日 | 品牌规格 | 备注
洗面奶 | 护肤品 | 1 | 瓶 | 2026-11-30 | CeraVe 236ml | 已开封
生抽 | 厨房调料 | 2 | 瓶 | 2027-03-01 | 李锦记 |
散粉 | 彩妆 | 1 | 盒 |  | NARS | 无明确到期日
`)

    assert.equal(result.errors.length, 0)
    assert.deepEqual(result.items, [
      {
        name: '洗面奶',
        category: '护肤品',
        quantity: 1,
        unit: '瓶',
        expiryDate: '2026-11-30',
        location: undefined,
        brand: 'CeraVe 236ml',
        notes: '已开封',
      },
      {
        name: '生抽',
        category: '厨房调料',
        quantity: 2,
        unit: '瓶',
        expiryDate: '2027-03-01',
        location: undefined,
        brand: '李锦记',
        notes: '',
      },
      {
        name: '散粉',
        category: '彩妆',
        quantity: 1,
        unit: '盒',
        expiryDate: undefined,
        location: undefined,
        brand: 'NARS',
        notes: '无明确到期日',
      },
    ])
  })

  it('reports invalid required fields without dropping valid rows', () => {
    const result = parseBulkInventoryText(`
空分类 |  | 1 | 件 | 2026-11-30
坏数量 | 护肤品 | 两个 | 件 | 2026-11-30
坏日期 | 护肤品 | 1 | 件 | 2026/11/30
有效项 | 护肤品 | 3 | 袋 | 
`)

    assert.deepEqual(result.items, [
      {
        name: '有效项',
        category: '护肤品',
        quantity: 3,
        unit: '袋',
        expiryDate: undefined,
        location: undefined,
        brand: '',
        notes: '',
      },
    ])
    assert.deepEqual(
      result.errors.map((error) => error.message),
      ['分类不能为空', '数量必须是大于 0 的数字', '到期日必须使用 YYYY-MM-DD 格式'],
    )
  })
})
