const API_BASE = 'https://monchan3.xsrv.jp/api'

export interface Monster {
  id: string
  name: string
  description: string
  iconUrl?: string
  imageUrl?: string
  size: string
  habitat?: string[]
  habitats?: string[]
  weaknesses: string[]
  resistances: string[]
  weakAttributes: Array<{
    name: string
    image?: string
  }>
  attackAttributes: Array<{
    name: string
    image?: string
  }>
  materials: Array<{
    name: string
    rarity: number
  }>
  rewards: Array<{
    name: string
    rarity: number
  }>
  species?: string
  threat?: string
  initialTitle?: string
}

export async function getMonsters(): Promise<Monster[]> {
  try {
    const url = `${API_BASE}/monsters.json`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch monsters: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}
