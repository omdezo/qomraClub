import fs from 'fs';
import path from 'path';

const cache: Record<string, any> = {};

function resolveDataPath(name: string): string | null {
  const candidates = [
    path.join(__dirname, '../../data', `${name}.json`),
    path.join(__dirname, '../../../data', `${name}.json`),
    path.join(process.cwd(), 'data', `${name}.json`),
    path.join(process.cwd(), 'server/data', `${name}.json`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function loadJson(name: string): any[] {
  if (cache[name]) return cache[name];
  try {
    const filePath = resolveDataPath(name);
    if (filePath) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      cache[name] = data;
      return data;
    }
    console.warn(`Fallback file not found: ${name}.json`);
  } catch (err) {
    console.error(`Failed to load fallback ${name}.json:`, err);
  }
  return [];
}

/**
 * Try DB query. If it fails, return JSON fallback.
 */
export async function withFallback<T>(
  collectionName: string,
  dbQuery: () => Promise<T[]>,
  filterFn?: (item: any) => boolean
): Promise<T[]> {
  try {
    return await dbQuery();
  } catch (err) {
    console.error(`DB query failed for ${collectionName}, using fallback:`, (err as Error).message);
  }
  const data = loadJson(collectionName);
  return (filterFn ? data.filter(filterFn) : data) as T[];
}

export async function withFallbackOne<T>(
  collectionName: string,
  dbQuery: () => Promise<T | null>
): Promise<T | null> {
  try {
    return await dbQuery();
  } catch (err) {
    console.error(`DB query failed for ${collectionName}, using fallback:`, (err as Error).message);
  }
  const data = loadJson(collectionName);
  return (data[0] ?? null) as T | null;
}
