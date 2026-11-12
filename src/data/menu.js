export const CATEGORIES = [
  { id: 'all', zh: '全部', en: 'All' },
  { id: 'grill', zh: '炭烤', en: 'Grill' },
  { id: 'drinks', zh: '飲品', en: 'Drinks' },
  { id: 'sweets', zh: '甜點', en: 'Sweets' },
]

export const MENU = [
  {
    id: 'oyster-omelette',
    zh: '蚵仔煎',
    en: 'Oyster Omelette',
    descZh: '鮮蚵・雞蛋・甜辣醬',
    descEn: 'Fresh oysters, egg, sweet chili glaze',
    price: 80,
    category: 'grill',
    emoji: '🍳',
    accent: 'from-amber-300/30 to-orange-700/20',
    image:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=360&q=70',
    popular: true,
  },
  {
    id: 'bubble-tea',
    zh: '珍珠奶茶',
    en: 'Bubble Milk Tea',
    descZh: '黑糖珍珠・鮮奶・紅茶',
    descEn: 'Brown sugar pearls, fresh milk, black tea',
    price: 60,
    category: 'drinks',
    emoji: '🧋',
    accent: 'from-orange-200/30 to-amber-800/20',
    image:
      'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=360&q=70',
    popular: true,
  },
  {
    id: 'popcorn-chicken',
    zh: '鹽酥雞',
    en: 'Popcorn Chicken',
    descZh: '九層塔・蒜香・椒鹽',
    descEn: 'Thai basil, garlic, white pepper salt',
    price: 70,
    category: 'grill',
    emoji: '🍗',
    accent: 'from-yellow-300/30 to-red-800/20',
    image:
      'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=360&q=70',
    popular: true,
  },
  {
    id: 'stinky-tofu',
    zh: '臭豆腐',
    en: 'Stinky Tofu',
    descZh: '金黃酥脆・台式泡菜',
    descEn: 'Crispy golden tofu, Taiwanese pickles',
    price: 65,
    category: 'grill',
    emoji: '🥘',
    accent: 'from-lime-300/20 to-emerald-800/20',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=360&q=70',
    popular: false,
  },
  {
    id: 'sausage',
    zh: '大腸包小腸',
    en: 'Taiwanese Sausage',
    descZh: '糯米腸・香腸・蒜片',
    descEn: 'Glutinous rice sausage, pork sausage, garlic',
    price: 75,
    category: 'grill',
    emoji: '🌭',
    accent: 'from-rose-300/25 to-red-900/20',
    image:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=360&q=70',
    popular: false,
  },
  {
    id: 'mango-ice',
    zh: '芒果冰',
    en: 'Mango Shaved Ice',
    descZh: '愛文芒果・煉乳・雪花冰',
    descEn: 'Irwin mango, condensed milk, snow ice',
    price: 90,
    category: 'sweets',
    emoji: '🥭',
    accent: 'from-amber-200/35 to-orange-700/20',
    image:
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=360&q=70',
    popular: true,
  },
]

export const findItem = (id) => MENU.find((item) => item.id === id)
