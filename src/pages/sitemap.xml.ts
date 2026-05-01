import { getMonsters } from '../lib/api';

export async function GET() {
  const monsters = await getMonsters();
  const baseUrl = 'https://monchan-encyclopedia.pages.dev';

  const pages = [
    { url: '/', lastmod: new Date().toISOString().split('T')[0], priority: '1.0' },
    { url: '/monsters', lastmod: new Date().toISOString().split('T')[0], priority: '0.9' },
    { url: '/attribute-search', lastmod: new Date().toISOString().split('T')[0], priority: '0.8' },
    ...monsters.map((m) => ({
      url: `/monsters/${m.id}`,
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.7',
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
