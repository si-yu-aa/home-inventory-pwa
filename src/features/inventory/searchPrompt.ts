export function buildSearchExpansionPrompt(keyword: string): string {
  const normalizedKeyword = keyword.trim()

  return [
    `我想在家庭库存 app 里搜索「${normalizedKeyword}」。`,
    '请帮我扩写这个关键词的近义词、常见商品叫法、品类词、品牌/规格可能相关的词。',
    '只输出一行搜索关键词，用空格分隔，不要解释。',
    '请尽量覆盖家庭库存场景，例如护肤品、彩妆、厨房调料、清洁用品、食品等。',
  ].join('\n')
}
