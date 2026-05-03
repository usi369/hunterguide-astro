import { useState } from 'react';

interface Monster {
  id: string;
  name: string;
  iconUrl: string;
  weakAttributes?: Array<{ label: string }>;
}

interface Attribute {
  name: string;
  label: string;
  iconUrl: string;
}

interface AttributeSearchFilterProps {
  monsters: Monster[];
}

const ATTRIBUTES: Attribute[] = [
  {
    name: '火',
    label: '火',
    iconUrl: 'https://pub-14ced31a180247fcb2f291b43046e2f4.r2.dev/element_fire.png',
  },
  {
    name: '水',
    label: '水',
    iconUrl: 'https://pub-14ced31a180247fcb2f291b43046e2f4.r2.dev/element_water.png',
  },
  {
    name: '雷',
    label: '雷',
    iconUrl: 'https://pub-14ced31a180247fcb2f291b43046e2f4.r2.dev/element_thunder.png',
  },
  {
    name: '氷',
    label: '氷',
    iconUrl: 'https://pub-14ced31a180247fcb2f291b43046e2f4.r2.dev/element_ice.png',
  },
  {
    name: '龍',
    label: '龍',
    iconUrl: 'https://pub-14ced31a180247fcb2f291b43046e2f4.r2.dev/element_dragon.png',
  },
];

export default function AttributeSearchFilter({ monsters }: AttributeSearchFilterProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);

  // Filter monsters based on selected attribute
  const filteredMonsters = selectedAttribute
    ? monsters.filter(m =>
        m.weakAttributes && m.weakAttributes.some((wa: any) => wa.label === selectedAttribute)
      )
    : monsters;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white hover:text-blue-400 transition">
            ← ホーム
          </a>
          <h1 className="text-2xl font-bold text-white">属性別検索</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Attribute Filter Bar */}
        <div className="mb-8 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {/* All Button */}
            <button
              onClick={() => setSelectedAttribute(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedAttribute === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              すべて
            </button>

            {/* Attribute Icons */}
            {ATTRIBUTES.map((attr) => (
              <button
                key={attr.name}
                onClick={() => setSelectedAttribute(attr.label)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg transition-all border-2 flex items-center justify-center ${
                  selectedAttribute === attr.label
                    ? 'border-blue-400 bg-blue-500 scale-110'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                }`}
                title={attr.name}
              >
                <img
                  src={attr.iconUrl}
                  alt={attr.name}
                  className="w-8 h-8 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Monster Count */}
        <div className="mb-6 text-slate-300">
          <p className="text-lg">
            {selectedAttribute ? `${selectedAttribute}が弱点` : 'すべて'} ({filteredMonsters.length}体)
          </p>
        </div>

        {/* Monsters Grid */}
        {filteredMonsters.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
            {filteredMonsters.map((monster) => (
              <a href={`/monsters/${monster.id}`} key={monster.id}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
                  {/* Icon Container */}
                  <div className="w-full aspect-square bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center relative overflow-hidden">
                    {monster.iconUrl ? (
                      <img
                        src={monster.iconUrl}
                        alt={monster.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <span className="text-3xl mb-2">🐉</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="p-2 text-center">
                    <h3 className="font-bold text-sm text-blue-900 line-clamp-2">
                      {monster.name}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              {selectedAttribute}が弱点のモンスターはいません
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
