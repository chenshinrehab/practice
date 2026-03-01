// src/data/europe.ts

export interface Spot {
  id: string;
  name: string;        // 景點名稱 (例如：羅馬競技場)
  description: string; // 景點描述
  image: string;       // 景點圖片
}

export interface CountryItem {
  id: string;
  title: string;       // 頁面主標題 (H1)
  countryName: string; 
  subtitle: string;    
  description: string; 
  image: string;       // 頁面頂部大圖
  // 💡 已移除 features 欄位
  spots: Spot[];       // 該國家的景點列表
}

export const europeCountries: Record<string, CountryItem> = {
  italy: {
    id: 'italy',
    title: '義大利全境深度包車之旅',
    countryName: '義大利',
    subtitle: 'Italy Heritage Journey',
    description: '從羅馬古城的永恆奇蹟，到神的故鄉多洛米蒂，我們帶您深入探索義大利的每一處角落。',
    image: '/images/europe/italy-hero.webp',
    spots: [
      {
        id: 'dolomites',
        name: '神的故鄉 - 多洛米蒂',
        description: '阿爾卑斯山最絕美的群峰，鋸齒狀的石灰岩與如鏡的湖泊，展現了大自然最壯闊、最純淨的姿態。',
        image: '/images/europe/italy/1.webp',
      },
      {
        id: 'civitadibagnoregio',
        name: '天空之城 - 白露里治奧',
        description: '這座漂浮於雲霧間的孤島古城，是宮崎駿筆下的靈感來源。走過唯一的長橋，踏入彷彿時間靜止的中世紀秘境。',
        image: '/images/europe/italy/2.webp',
      },

      {
        id: 'valdorcia',
        name: '奧爾恰山谷與絲柏之路',
        description: '托斯卡尼最具代表性的田園景致。沿著蜿蜒的絲柏之路前行，在起伏的丘陵間尋找如詩如畫的莊園。',
        image: '/images/europe/italy/3.webp',
      },
      {
        id: 'milan',
        name: '藝術殿堂 - 米蘭大教堂',
        description: '矗立於時尚之都的哥德式建築傑作。登上樓頂觀景台，在數千座尖塔之間俯瞰米蘭的繁華與雅致。',
        image: '/images/europe/italy/4.webp',
      },
      {
        id: 'cinqueterre',
        name: '絕美沿海 - 五漁村',
        description: '鑲嵌在懸崖上的五座彩色村莊。乘著專車前往最佳觀景點，將繽紛建築與湛藍地中海交織的絕景盡收眼底。',
        image: '/images/europe/italy/5.webp',
      },
      {
        id: 'amalfi',
        name: '人間天堂 - 阿瑪菲海岸',
        description: '被譽為一生必訪的絕美海岸線。沿著斷崖公路蜿蜒前行，感受波西塔諾色彩斑斕的層疊房屋與海風氣息。',
        image: '/images/europe/italy/6.webp',
      }
    ]
  },

  switzerland: {
    id: 'switzerland',
    title: '瑞士：阿爾卑斯純淨之美',
    countryName: '瑞士',
    subtitle: 'Swiss Alpine Majesty',
    description: '免去拖著沉重行李在火車間換乘的疲憊。我們帶您深入少女峰與馬特洪峰的壯闊地景，探尋隱藏於雪山間的藍寶石湖泊。',
    image: '/images/europe/swiss-hero.webp',
    spots: [
      {
        id: 'jungfrau-region',
        name: '歐洲之巔 - 少女峰地區',
        description: '在伯恩高地的雪山環抱下，領略三巨峰的磅礴氣勢。無論是格林德瓦的小鎮風光還是瀑布鎮的壯觀，皆是阿爾卑斯最經典的象徵。',
        image: '/images/europe/switzerland/1.webp',
      },
      {
        id: 'matterhorn',
        name: '山中之王 - 馬特洪峰',
        description: '矗立於策馬特的金字塔型巨岩。跟隨司導前往最理想的觀賞點，捕捉清晨第一道曙光照亮山尖的「黃金日出」奇景。',
        image: '/images/europe/switzerland/2.webp',
      },
      {
        id: 'lake-luzern',
        name: '優雅湖光 - 琉森湖區',
        description: '漫步在古老的卡貝爾橋與湖畔，感受中世紀優雅氣息。乘著微風眺望遠方的皮拉圖斯山，沉浸在瑞士心臟地帶的靜謐之中。',
        image: '/images/europe/switzerland/3.webp',
      },
      {
        id: 'blausee',
        name: '深藍眼淚 - 藍湖',
        description: '隱身在原始森林中的神祕湖泊。剔透晶瑩的湖水呈現出不可思議的深藍色，清澈見底的湖面倒映著阿爾卑斯山的絕美倒影。',
        image: '/images/europe/switzerland/4.webp',
      },
      {
        id: 'oeschinensee',
        name: '雪山明鏡 - 厄希嫩湖',
        description: '被列入世界自然遺產的高山湖泊。四周懸崖峭壁環繞，翠綠的水面與終年不化的積雪交相輝映，是瑞士人私藏的戶外天堂。',
        image: '/images/europe/switzerland/5.webp',
      },
      {
        id: 'ebenalp',
        name: '絕壁奇觀 - 埃本阿爾卑',
        description: '搭乘纜車直達斷崖之巔。鑲嵌在懸崖峭壁間的野生教堂與古老客棧，展現了人類文明與大自然鬼斧神工的和諧並存。',
        image: '/images/europe/switzerland/6.webp',
      }
    ]
  },

  franceGermany: {
    id: 'franceGermany',
    title: '德法經典：中世紀童話與花都浪漫',
    countryName: '德法',
    subtitle: 'Franco-German Classic Heritage',
    description: '從萊茵河畔的古老城堡，到巴黎街頭的時尚藝術。我們跨越邊境，帶您領略德意志的嚴謹工藝與法蘭西的浪漫靈魂。',
    image: '/images/europe/france-germany-hero.webp',
    spots: [
      {
        id: 'neuschwanstein',
        name: '夢幻原形 - 新天鵝堡',
        description: '矗立於巴伐利亞山間的浪漫主義傑作。這座迪士尼城堡的原型，在雲霧繚繞中展現出國王路德維希二世最純粹的童話夢想。',
        image: '/images/europe/franceGermany/1.webp',
      },
      {
        id: 'cologne-cathedral',
        name: '哥德巔峰 - 科隆大教堂',
        description: '耗時六百年打造的建築奇蹟。黝黑莊嚴的雙塔直達雲霄，精緻的石雕與彩繪玻璃，訴說著德意志民族對信仰的極致追求。',
        image: '/images/europe/franceGermany/2.webp',
      },
      {
        id: 'eiffel-tower',
        name: '花都地標 - 巴黎艾菲爾鐵塔',
        description: '巴黎最無可取代的象徵。無論是戰神廣場的午後野餐，還是夜晚閃爍的金光，都能讓您感受到最純粹的法式優雅。',
        image: '/images/europe/franceGermany/3.webp',
      },
      {
        id: 'eltz-castle',
        name: '森林秘境 - 伊茲城堡',
        description: '隱藏在山谷深處的千年古堡。未受戰火洗禮的完整外觀，讓它成為德國最受攝影師青睞、最具神祕色彩的私人宅邸。',
        image: '/images/europe/franceGermany/4.webp',
      },
      {
        id: 'alsace-villages',
        name: '彩色童話 - 阿爾薩斯酒鄉小鎮',
        description: '漫步在柯瑪或里克威爾的木桁架建築間。這片位於德法邊界的產酒區，融合了兩國建築特色，宛如走進真實版《美女與野獸》場景。',
        image: '/images/europe/franceGermany/5.webp',
      },
      {
        id: 'loire-valley',
        name: '王室庭園 - 羅亞爾河谷城堡群',
        description: '走訪「法國花園」中的香波堡與雪儂梭堡。沿著河谷穿梭於昔日王室的狩獵場與宮廷，體驗極致奢華的貴族生活軌跡。',
        image: '/images/europe/franceGermany/6.webp',
      }
    ]
  },
  
  centraleurope: {
    id: 'centraleurope',
    title: '奧捷匈：中歐帝國風華與童話小鎮',
    countryName: '奧捷匈',
    subtitle: 'Imperial Central Europe',
    description: '穿梭於哈布斯堡王朝的輝煌記憶，從夢幻的波希米亞小鎮到多瑙河畔的璀璨珍珠，我們帶您跨越國境，探索中歐最迷人的文化底蘊。',
    image: '/images/europe/central-hero.webp',
    spots: [
      {
        id: 'hallstatt',
        name: '仙境小鎮 - 哈修塔特',
        description: '被譽為世界最美的湖畔小鎮。依山傍水的木屋建築與晨曦中的湖光倒影，構成了一幅讓人屏息的明信片絕景。',
        image: '/images/europe/centraleurope/1.webp',
      },
      {
        id: 'cesky-krumlov',
        name: '童話古城 - 庫倫洛夫',
        description: '被伏爾塔瓦河環繞的 S 型絕美小鎮。紅屋瓦與中世紀城堡交織，彷彿穿越時空步入波希米亞的浪漫夢境。',
        image: '/images/europe/centraleurope/2.webp',
      },
      {
        id: 'fishermans-bastion',
        name: '多瑙之光 - 漁人堡',
        description: '矗立於布達佩斯城堡山上的新羅馬式建築。透過拱門俯瞰多瑙河與國會大廈，感受這座「東歐巴黎」的壯麗與深情。',
        image: '/images/europe/centraleurope/3.webp',
      },
      {
        id: 'grossglockner',
        name: '巔峰絕景 - 大葛洛克納高山公路',
        description: '奧地利最高峰下的景觀公路。在海拔兩千多公尺的蜿蜒中，直面壯闊的冰河遺產與阿爾卑斯山的原始震撼。',
        image: '/images/europe/centraleurope/4.webp',
      },
      {
        id: 'bohemian-paradise',
        name: '奇岩地景 - 波希米亞天堂',
        description: '捷克境內最獨特的石灰岩林區。巨大的石柱、幽靜的峽谷與掩映其中的城堡，帶您走入一段充滿奇幻色彩的自然冒險。',
        image: '/images/europe/centraleurope/5.webp',
      },
      {
        id: 'danube-bend',
        name: '河畔古趣 - 多瑙河灣三小鎮',
        description: '走訪聖安德烈、維榭格拉德與埃斯泰爾戈姆。在多瑙河轉彎處，細品匈牙利最優雅的藝術氛圍與歷史遺跡。',
        image: '/images/europe/centraleurope/6.webp',
      }
    ]
  },

};