import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { isShopCategory, shopItems, type ShopItem } from '../data/shop';
import { db } from './firebase';

export interface ManagedShopItem extends ShopItem { sortOrder: number }
function text(value: unknown, fallback = ''): string { return typeof value === 'string' ? value : fallback; }
export async function getPublicShopCatalog(): Promise<ShopItem[]> {
  if (!db) return [...shopItems];
  const [snapshot, marker] = await Promise.all([
    getDocs(collection(db, 'shop')),
    getDoc(doc(db, 'shopConfig', 'catalog')),
  ]);
  if (snapshot.empty && marker.data()?.managed !== true) return [...shopItems];
  return snapshot.docs.map((item, index) => {
    const data = item.data();
    const category = isShopCategory(data.category) ? data.category : 'memberships';
    return {
      id: text(data.id, item.id),
      category,
      name: text(data.name, 'Untitled product'),
      description: text(data.description),
      priceRobux: typeof data.priceRobux === 'number' && Number.isFinite(data.priceRobux) ? data.priceRobux : 0,
      image: text(data.image) || undefined,
      perks: Array.isArray(data.perks) ? data.perks.filter((perk): perk is string => typeof perk === 'string') : undefined,
      details: text(data.details) || undefined,
      gamePassUrl: text(data.gamePassUrl),
      featured: data.featured === true,
      available: data.available === true,
      sortOrder: typeof data.sortOrder === 'number' && Number.isFinite(data.sortOrder) ? data.sortOrder : index,
    } satisfies ManagedShopItem;
  }).sort((a, b) => a.sortOrder - b.sortOrder);
}
