// types/lottery.ts
export interface Prize {
  id: string
  name: string
  image: string
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
