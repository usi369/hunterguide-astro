import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = 'https://monchan-friend-api.usi369.workers.dev';
const POSTS_PAGE_SIZE = 10;

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

function formatCode(value) {
  if (!value) return '-';
  return String(value);
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
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-black text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:h-8 lg:w-8 lg:text-xs"
      aria-label={`${label}をコピー`}
      title={`${label}をコピー`}
    >
      {copied ? 'OK' : 'Copy'}
    </button>
  );
}

function CodePanel({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-blue-100 bg-blue-50/80 p-3 lg:p-2.5">
      <p className="text-xs font-black text-blue-700 lg:text-[11px]">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3 lg:gap-2">
        <p className="min-w-0 whitespace-nowrap font-mono text-base font-black tracking-normal text-blue-950 sm:text-lg lg:text-sm">
          {formatCode(value)}
        </p>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}

function FriendPostCard({ post, index }) {
  const postedDate = formatPostDate(post.createdAt);
  const expiresAt = formatExpiry(post.expiresAt);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-sky-900/10 ring-1 ring-sky-100">
      <div className="flex items-center justify-between bg-sky-50 px-4 py-3 lg:py-2">
        <p className="text-sm font-black text-blue-800">投稿 #{index + 1}</p>
        <p className="text-xs font-black text-slate-500">{postedDate}</p>
      </div>

      <div className="p-4 lg:p-3">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,24rem)_16rem] lg:items-stretch lg:justify-center">
          <div className="min-w-0">
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={`${post.hunterName || 'ハンター'}さんの自己紹介カード`}
                loading="lazy"
                className="aspect-[1.72/1] w-full rounded-2xl border border-sky-100 object-cover shadow-sm lg:h-36 lg:aspect-auto lg:object-contain"
              />
            ) : (
              <div className="flex aspect-[1.72/1] w-full items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 text-sm font-black text-sky-500 lg:h-36 lg:aspect-auto">
                画像なし
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
              <CodePanel label="フレンドコード" value={post.friendCode} />
              <CodePanel label="招待コード" value={post.inviteCode} />
            </div>
          </div>

          <aside className="hidden rounded-2xl border border-sky-100 bg-sky-50/70 p-3 shadow-sm lg:block">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-500">
              Hunter Codes
            </p>
            <div className="mt-2 grid gap-2">
              <CodePanel label="フレンドコード" value={post.friendCode} />
              <CodePanel label="招待コード" value={post.inviteCode} />
            </div>
            {expiresAt && (
              <p className="mt-2 text-right text-[10px] font-bold text-slate-400">
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
      <div className="mx-auto max-w-md lg:max-w-3xl">
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

        <section className="space-y-4 lg:space-y-3">
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
