/**
 * Landmark collection for the museum carousel.
 *
 * To add a landmark: append an object here. The carousel, counter, flip card
 * and navigation are all derived from this array. `icon` is a key from the
 * ICONS registry in `src/scenes/Museum.jsx`; unknown keys fall back to a
 * generic museum mark.
 */
export const landmarks = [
  {
    id: 'taipei-101',
    name: 'Taipei 101',
    nameZh: '台北 101',
    location: '台北 · 信義區',
    era: '2004',
    accent: '#e8bd7c',
    image: '/landmarks/taipei-101.svg',
    focal: 'center 55%',
    icon: 'tower',
    description:
      "Once the world's tallest tower, Taipei 101 rises in eight bamboo-like tiers. A 660-tonne golden damper sways inside to steady the building through typhoons and earthquakes.",
    descriptionZh:
      '曾是世界第一高樓，八層竹節般的塔身象徵節節高升。塔內六百六十噸重的金色阻尼球，在颱風與地震中穩住整座大樓。',
  },
  {
    id: 'jiufen',
    name: 'Jiufen',
    nameZh: '九份',
    location: '新北 · 瑞芳',
    era: '1890s',
    accent: '#ef9a8f',
    image: '/landmarks/jiufen.svg',
    focal: 'center 55%',
    icon: 'lantern',
    description:
      "A gold-mining town spilling down a rain-soaked hillside, Jiufen's red lanterns and teahouses are said to have inspired Spirited Away. When the mines closed, its stairways found a second life in film.",
    descriptionZh:
      '因金礦而繁華的山城，紅燈籠與茶樓在雨霧中亮起，相傳啟發了《神隱少女》。礦業落幕後，石階老屋在電影裡重生。',
  },
  {
    id: 'taroko-gorge',
    name: 'Taroko Gorge',
    nameZh: '太魯閣峽谷',
    location: '花蓮 · 立霧溪',
    era: '1986',
    accent: '#8fc6ba',
    image: '/landmarks/taroko-gorge.svg',
    focal: 'center 52%',
    icon: 'mountain',
    description:
      "The Liwu River has carved Taroko's marble walls for millions of years, leaving them turquoise in the half-light. Its name comes from the Truku people, who have lived in these mountains for centuries.",
    descriptionZh:
      '立霧溪以百萬年時光切鑿大理石峽谷，岩壁在微光中透出青碧。地名源自太魯閣族，數百年來以這片山林為家。',
  },
  {
    id: 'sun-moon-lake',
    name: 'Sun Moon Lake',
    nameZh: '日月潭',
    location: '南投 · 魚池',
    era: '1934',
    accent: '#a9cbd0',
    image: '/landmarks/sun-moon-lake.svg',
    focal: '68% center',
    icon: 'lake',
    description:
      'The eastern shore curves like a sun, the western like a crescent moon. Thao legend says the lake was found while hunting a white deer; today temples and cable cars circle the water.',
    descriptionZh:
      '潭東如日、潭西如月。邵族傳說裡，祖先追逐白鹿而發現這片湖水；如今寺廟與纜車繞著碧水而行。',
  },
  {
    id: 'alishan',
    name: 'Alishan',
    nameZh: '阿里山',
    location: '嘉義 · 阿里山',
    era: '1912',
    accent: '#d9c7ab',
    image: '/landmarks/alishan.svg',
    focal: '42% center',
    icon: 'cloud',
    description:
      'Ancient cypress forest floats above a sea of clouds. Built in 1912 to haul timber, the narrow-gauge forest railway now carries travellers up for sunrise over the Central Mountain Range.',
    descriptionZh:
      '千年紅檜林浮在雲海之上。一九一二年為運送木材而建的森林鐵路，如今載著旅人上山，迎接中央山脈的日出。',
  },
  {
    id: 'longshan-temple',
    name: 'Longshan Temple',
    nameZh: '龍山寺',
    location: '台北 · 艋舺',
    era: '1738',
    accent: '#d8a46a',
    image: '/landmarks/longshan-temple.svg',
    focal: 'center 55%',
    icon: 'temple',
    description:
      "Founded in 1738, Longshan Temple is Bangka's spiritual heart. Its swallowtail roof, carved pillars and drifting incense smoke have sheltered worshippers through centuries of fires, typhoons and rebuilding.",
    descriptionZh:
      '始建於一七三八年的龍山寺，是艋舺的信仰中心。燕尾屋脊、精雕石柱與繚繞香火，陪伴人們走過火災、風災與一次次重建。',
  },
]
