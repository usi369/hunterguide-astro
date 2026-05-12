import monstersData from '../data/monsters.json'

export interface Monster {
  id: string
  number?: number
  name: string
  description: string
  alias?: string
  grade?: string
  grades?: string[]
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
  weapons?: string[]
}

export async function getMonsters(): Promise<Monster[]> {
  return monstersData as Monster[]
}
