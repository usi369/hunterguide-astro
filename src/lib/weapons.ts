import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getMonsters } from './api';

export interface Weapon {
  weaponId: string;
  number: string;
  name: string;
  category: string;
  element: string;
  monster: string;
}

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

const WEAPONS_CSV_PATH = path.join(process.cwd(), 'master', 'MHNow_モンスター情報 - 武器一覧.csv');

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r') {
      if (input[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function makeIndex(header: string[]) {
  return header.reduce<Record<string, number>>((acc, name, index) => {
    acc[name] = index;
    return acc;
  }, {});
}

export async function getWeapons(): Promise<Weapon[]> {
  const csv = await readFile(WEAPONS_CSV_PATH, 'utf8');
  const rows = parseCsv(csv).filter((row) => row.length > 1);
  const header = rows[0] || [];
  const index = makeIndex(header);

  return rows.slice(1).map((row) => ({
    weaponId: row[index.WeaponID] || '',
    number: row[index['No.']] || '',
    name: row[index.Name] || '',
    category: row[index['カテゴリー']] || '',
    element: row[index['属性']] || '',
    monster: row[index['モンスター']] || '',
  }));
}

export async function getMonsterWeaponSummaries(): Promise<MonsterWeaponSummary[]> {
  const weapons = await getWeapons();
  const monsters = await getMonsters();
  const weaponSummaries = new Map<string, { categories: Set<string>; weaponCount: number }>();

  weapons.forEach((weapon) => {
    const monster = weapon.monster.trim();
    if (!monster || monster === 'なし') return;

    if (!weaponSummaries.has(monster)) {
      weaponSummaries.set(monster, { categories: new Set(), weaponCount: 0 });
    }

    const summary = weaponSummaries.get(monster);
    if (!summary) return;

    if (weapon.category) summary.categories.add(weapon.category);
    summary.weaponCount += 1;
  });

  return [...monsters]
    .sort((a, b) => Number(b.number ?? 0) - Number(a.number ?? 0))
    .map((monster) => {
      const summary = weaponSummaries.get(monster.name);
      const categories = monster.weapons?.length
        ? [...monster.weapons]
        : [...(summary?.categories || [])];

      return {
        id: monster.id,
        number: monster.number,
        monster: monster.name,
        iconUrl: monster.iconUrl,
        grade: monster.grade,
        species: monster.species,
        categories: categories.sort((a, b) => {
        const orderA = WEAPON_CATEGORY_ORDER.indexOf(a);
        const orderB = WEAPON_CATEGORY_ORDER.indexOf(b);
        if (orderA !== -1 && orderB !== -1) return orderA - orderB;
        if (orderA !== -1) return -1;
        if (orderB !== -1) return 1;
        return a.localeCompare(b, 'ja');
        }),
        weaponCount: summary?.weaponCount ?? 0,
      };
    });
}
