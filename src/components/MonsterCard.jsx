export default function MonsterCard({ monster }) {
  return (
    <a href={`/monsters/${monster.id}`} className="group block">
      <div className="aspect-square rounded-md border border-slate-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="flex h-full w-full items-center justify-center p-2 sm:p-3">
          {monster.iconUrl ? (
            <img
              src={monster.iconUrl}
              alt={monster.name}
              loading="lazy"
              className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
              <span className="text-3xl">🐉</span>
              <span className="mt-1 text-[10px]">No image</span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 break-words text-[12px] font-bold leading-snug text-slate-950 sm:text-sm">
        {monster.name}
      </p>
    </a>
  );
}
