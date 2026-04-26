import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * Deterministic shuffle using a seed.
 * Same seed → same order. Date-based seed gives "photo of the day" rotation.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDailySeed(): number {
  const d = new Date();
  // YYYYMMDD as integer
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

/**
 * Returns N random photos from the QomraWeekPhoto pool.
 * Order is deterministic per day (same set of photos all day, new set tomorrow).
 * Use ?offset=N to slice further from the same day's deck.
 */
export const getRandomPhotos = async (req: Request, res: Response): Promise<void> => {
  const count = Math.min(Math.max(Number(req.query.count) || 10, 1), 100);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const extraSeed = req.query.seed ? Number(req.query.seed) || 0 : 0;

  try {
    const photos = await prisma.qomraWeekPhoto.findMany({
      where: { isPublished: true, imageUrl: { not: '' } },
      select: { id: true, imageUrl: true, editionNumber: true },
    });

    const seed = getDailySeed() + extraSeed;
    const shuffled = seededShuffle(photos, seed);
    const slice = shuffled.slice(offset, offset + count);

    // Cache for 1 hour, allow stale for 1 day (rotates daily)
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.json(slice);
  } catch (err) {
    res.json([]);
  }
};
