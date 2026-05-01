import type { APIRoute } from 'astro';
import monstersData from '../../data/monsters.json';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(monstersData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
