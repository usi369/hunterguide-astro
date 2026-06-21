import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = 'https://monchan-friend-api.usi369.workers.dev';
const POSTS_PAGE_SIZE = 10;

const weaponLabels = {
  sword_and_shield: '片手剣',
  swordShield: '片手剣',
  sword: '片手剣',
  dual_blades: '双剣',
  dualBlades: '双剣',
  great_sword: '大剣',
  greatSword: '大剣',
  katana: '太刀',
  long_sword: '太刀',
  longSword: '太刀',
  hammer: 'ハンマー',
  hunting_horn: '狩猟笛',
  huntingHorn: '狩猟笛',
  lance: 'ランス',
  gunlance: 'ガンランス',
  switch_axe: 'スラアク',
  switchAxe: 'スラアク',
  charge_blade: 'チャアク',
  chargeBlade: 'チャアク',
  insect_glaive: '操虫棍',
  insectGlaive: '操虫棍',
  light_bowgun: 'ライト',
  lightBowgun: 'ライト',
  heavy_bowgun: 'ヘビィ',
  heavyBowgun: 'ヘビィ',
  bow: '弓',
};

const playTimeLabels = {
  morning: '朝',
  daytime: '昼',
  day: '昼',
  evening: '夕',
  night: '夜',
  midnight: '深夜',
};

function normalizePosts(payload) {
  if (Array.isArray(payload)) return { posts: payload, nextCursor: null };
  return {
    posts: Array.isArray(payload?.posts) ? payload.posts : [],
    nextCursor: payload?.nextCursor || null,
  };
}

function formatPostDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  return `${date.getMonth() + 1}/${date.getDate()} (${weekday})`;
}

function formatExpiry(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function compactCode(value) {
  if (!value) return '-';
  if (value.length <= 10) return value;
  return `${value.slice(0, 4)} ${value.slice(4, 8)}...`;
}

function labelFromMap(value, labels) {
  if (!value) return '';
  return labels[value] || String(value);
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-black text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      aria-label={`${label}をコピー`}
      title={`${label}をコピー`}
    >
      {copied ? 'OK' : 'Copy'}
    </button>
  );
}

function CodePanel({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-blue-100 bg-blue-50/80 p-3">
      <p className="text-xs font-black text-blue-700">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-mono text-lg font-black tracking-wide text-blue-950">
          {compactCode(value)}
        </p>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}

function FriendPostCard({ post, index }) {
  const weapons = Array.isArray(post.weapons) ? post.weapons : [];
  const playTimes = Array.isArray(post.playTimes) ? post.playTimes : [];
  const location = [post.country, post.area].filter(Boolean).join(' / ');
  const postedDate = formatPostDate(post.createdAt);
  const expiresAt = formatExpiry(post.expiresAt);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-sky-900/10 ring-1 ring-sky-100">
      <div className="flex items-center justify-between bg-sky-50 px-4 py-3">
        <p className="text-sm font-black text-blue-800">投稿 #{index + 1}</p>
        <p className="text-xs font-black text-slate-500">{postedDate}</p>
      </div>

      <div className="p-4 lg:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="min-w-0">
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={`${post.hunterName || 'ハンター'}さんの自己紹介カード`}
                loading="lazy"
                className="aspect-[1.72/1] w-full rounded-2xl border border-sky-100 object-cover shadow-sm"
              />
            ) : (
              <div className="flex aspect-[1.72/1] w-full items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 text-sm font-black text-sky-500">
                画像なし
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
              <CodePanel label="フレンドコード" value={post.friendCode} />
              <CodePanel label="招待コード" value={post.inviteCode} />
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black tracking-normal text-blue-950 lg:text-2xl">
                  {post.hunterName || '名無しハンター'}
                </h2>
                <p className="mt-1 text-sm font-bold text-blue-700">
                  {playTimes.map((time) => labelFromMap(time, playTimeLabels)).filter(Boolean).join(' / ') || 'プレイ時間未設定'}
                </p>
              </div>
              <p className="shrink-0 text-right text-sm font-black text-slate-600">
                {location || 'エリア未設定'}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {weapons.length > 0 ? (
                weapons.map((weapon) => (
                  <span
                    key={weapon}
                    className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-black text-slate-700"
                  >
                    {labelFromMap(weapon, weaponLabels)}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-black text-slate-400">
                  武器未設定
                </span>
              )}
            </div>

            {post.comment && (
              <p className="mt-4 break-words rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                {post.comment}
              </p>
            )}
          </div>

          <aside className="hidden rounded-2xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm lg:block">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-500">
              Hunter Codes
            </p>
            <div className="mt-3 grid gap-3">
              <CodePanel label="フレンドコード" value={post.friendCode} />
              <CodePanel label="招待コード" value={post.inviteCode} />
            </div>
            {expiresAt && (
              <p className="mt-4 text-right text-[11px] font-bold text-slate-400">
                表示期限 {expiresAt}
              </p>
            )}
          </aside>
        </div>

        {expiresAt && (
          <p className="mt-3 text-right text-[11px] font-bold text-slate-400 lg:hidden">
            表示期限 {expiresAt}
          </p>
          )}
      </div>
    </article>
  );
}

export default function FriendPostTimeline() {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const totalText = useMemo(() => `${posts.length}件`, [posts.length]);

  async function loadPosts(cursor) {
    const params = new URLSearchParams({ limit: String(POSTS_PAGE_SIZE) });
    if (cursor) params.set('cursor', cursor);

    const response = await fetch(`${API_BASE_URL}/api/posts?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return normalizePosts(await response.json());
  }

  useEffect(() => {
    let mounted = true;

    loadPosts()
      .then((data) => {
        if (!mounted) return;
        setPosts(data.posts);
        setNextCursor(data.nextCursor);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('投稿を読み込めませんでした。時間をおいて再度お試しください。');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const data = await loadPosts(nextCursor);
      setPosts((currentPosts) => {
        const existingIds = new Set(currentPosts.map((post) => post.id).filter(Boolean));
        const newPosts = data.posts.filter((post) => !post.id || !existingIds.has(post.id));
        return [...currentPosts, ...newPosts];
      });
      setNextCursor(data.nextCursor);
      setError('');
    } catch {
      setError('追加の投稿を読み込めませんでした。');
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-50 px-4 pb-12 pt-5">
      <div className="mx-auto max-w-md lg:max-w-5xl">
        <header className="mb-5">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-normal text-blue-950">
                自己紹介カード
              </h1>
              <p className="mt-1 text-sm font-black text-blue-700">
                フレンド募集の新着投稿
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="rounded-full bg-white/75 px-4 py-2 text-sm font-black text-blue-800 shadow-sm ring-1 ring-white/80">
              新着順
            </span>
            <span className="rounded-full bg-blue-900 px-4 py-2 text-sm font-black text-white shadow-sm">
              {totalText}
            </span>
          </div>
        </header>

        {loading && (
          <div className="rounded-2xl bg-white/80 p-6 text-center text-sm font-black text-blue-800 shadow-sm">
            投稿を読み込んでいます
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-5 text-sm font-bold leading-relaxed text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-center text-sm font-black text-slate-500 shadow-sm">
            現在表示できる投稿はありません
          </div>
        )}

        <section className="space-y-4">
          {posts.map((post, index) => (
            <FriendPostCard key={post.id || `${post.createdAt}-${index}`} post={post} index={index} />
          ))}
        </section>

        {nextCursor && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-300"
            >
              {loadingMore ? '読み込み中' : 'もっと見る'}
            </button>
          </div>
        )}

        {!nextCursor && posts.length > 0 && (
          <p className="mt-6 text-center text-xs font-black text-blue-700/70">
            すべて表示しました
          </p>
        )}
      </div>
    </div>
  );
}
