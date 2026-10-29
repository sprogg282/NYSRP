export type ShopCategory = 'memberships' | 'donations' | 'advertisements';

export interface ShopItem {
  /** Unique short id, for example: membership-gold. */
  id: string;
  /** Pick one category: memberships, donations, or advertisements. */
  category: ShopCategory;
  /** Product title shown in the shop. */
  name: string;
  /** A short, accurate description. */
  description: string;
  /** Price shown to shoppers, in Robux. Enter the matching Game Pass price. */
  priceRobux: number;
  /** Optional path under public/, for example /images/shop/membership.png. */
  image?: string;
  /** Optional membership benefits; only set for confirmed benefits. */
  perks?: string[];
  /** Optional advertising duration/details, if confirmed. */
  details?: string;
  /** Paste the real Roblox Game Pass URL here. Empty means Coming Soon. */
  gamePassUrl: string;
  /** Persistent display position managed from /admin. */
  sortOrder?: number;
  /** Set true to feature the card visually. */
  featured?: boolean;
  /** False marks the item unavailable and disables purchase. */
  available: boolean;
}

export const shopItems: ShopItem[] = [
  // COPY THIS TEMPLATE for each real product, replace every placeholder,
  // then remove the comment markers. This example is not shown in the shop.
  // {
  //   id: 'replace-with-unique-id',
  //   category: 'memberships', // memberships | donations | advertisements
  //   name: 'Replace with product name',
  //   description: 'Replace with an approved description.',
  //   priceRobux: 100, // PLACEHOLDER EXAMPLE ONLY: change to the Game Pass price
  //   image: '/images/shop/your-image.png',
  //   perks: ['PLACEHOLDER: replace with confirmed membership benefit'],
  //   details: 'PLACEHOLDER: optional advertising duration or other detail',
  //   gamePassUrl: 'PASTE_YOUR_ROBLOX_GAME_PASS_URL_HERE',
  //   featured: false,
  //   available: true,
  // },
];
/** True only for HTTPS Roblox Game Pass pages, never generic or malformed URLs. */
export function isRobloxGamePassUrl(value:string):boolean{try{const url=new URL(value);return url.protocol==='https:'&&(url.hostname==='roblox.com'||url.hostname.endsWith('.roblox.com'))&&/^\/game-pass\/\d+(\/|$)/.test(url.pathname)}catch{return false}}

/** Filter shop records for one category; optional array supports isolated checks. */
export function getShopItemsByCategory(category:ShopCategory,items:ShopItem[]=shopItems):ShopItem[]{return items.filter(item=>item.category===category)}

export function isShopCategory(value: unknown): value is ShopCategory {
  return value === 'memberships' || value === 'donations' || value === 'advertisements';
}
export function sortShopItems(items: ShopItem[]): ShopItem[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));
}
