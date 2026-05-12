import { getMonsters } from './api';

export interface MonsterWeaponSummary {
  id: string;
  number?: number;
  monster: string;
  iconUrl?: string;
  grade?: string;
  species?: string;
  categories: string[];
  weaponCount: number;
}

export const WEAPON_CATEGORY_ORDER = [
  '片手剣',
  '双剣',
  '大剣',
  '太刀',
  'ハンマー',
  '狩猟笛',
  'ランス',
  'ガンランス',
  'スラッシュアックス',
  'チャージアックス',
  '操虫棍',
  'ライトボウガン',
  'ヘビィボウガン',
  '弓',
];

function sortWeaponCategories(categories: string[]) {
  return [...categories].sort((a, b) => {
    const orderA = WEAPON_CATEGORY_ORDER.indexOf(a);
    const orderB = WEAPON_CATEGORY_ORDER.indexOf(b);
    if (orderA !== -1 && orderB !== -1) return orderA - orderB;
    if (orderA !== -1) return -1;
    if (orderB !== -1) return 1;
    return a.localeCompare(b, 'ja');
  });
}

export async function getMonsterWeaponSummaries(): Promise<MonsterWeaponSummary[]> {
  const monsters = await getMonsters();

  return [...monsters]
    .sort((a, b) => Number(b.number ?? 0) - Number(a.number ?? 0))
    .map((monster) => {
      const categories = sortWeaponCategories(monster.weapons || []);

      return {
        id: monster.id,
        number: monster.number,
        monster: monster.name,
        iconUrl: monster.iconUrl,
        grade: monster.grade,
        species: monster.species,
        categories,
        weaponCount: categories.length,
      };
    });
}
