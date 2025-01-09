// types/lottery.ts
export interface Prize {
  id: string
  prizeName: string
  prizeImage: string
  prizeRank: string
}

export interface Position {
  row: number
  col: number
  index: number
  order: number
}

export interface LayoutResult {
  positions: Position[]
  side: number
}
