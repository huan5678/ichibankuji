export interface DrawSet {
  id: string
  name: string
  description?: string
  image?: string
  maxDraws: number
  price: number
  enabled: boolean
}

export interface DrawResult {
  prizeId: string
  prizeName: string
  prizeImage: string
}
