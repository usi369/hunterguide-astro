export default function MonsterCard({ monster }) {
  return (
    <a href={`/monsters/${monster.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
        {/* Icon/Image Container */}
        <div className="w-full h-40 bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center relative overflow-hidden">
          {monster.iconUrl ? (
            <img
              src={monster.iconUrl}
              alt={monster.name}
              className="w-32 h-32 object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <span className="text-4xl mb-2">🐉</span>
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-blue-900 mb-2 line-clamp-2">
            {monster.name}
          </h3>

          {/* Weak Attributes */}
          {monster.weakAttributes && monster.weakAttributes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">弱点</p>
              <div className="flex gap-1 flex-wrap">
                {monster.weakAttributes.slice(0, 3).map((attr) => (
                  <span
                    key={attr.name}
                    className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold"
                  >
                    {attr.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <p className="text-xs text-gray-600">
            <span className="font-semibold">サイズ:</span> {monster.size}
          </p>
        </div>
      </div>
    </a>
  );
}
