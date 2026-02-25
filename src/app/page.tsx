// src/app/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic' 
import JsonLd from '@/components/JsonLd'
import { newsList } from '@/data/news'
import ScrollAnimation from '@/components/ScrollAnimation'

// ✨ 僅引入需要的 React Icons 替換 FontAwesome，修正 FaSquareParking 為 FaParking
import { 
  FaBell, 
  FaChevronRight, 
  FaGraduationCap, 
  FaBriefcase, 
  FaArrowRight, 
  FaHospital, 
  FaStar, 
  FaParking, 
  FaWheelchair, 
  FaCircle, 
  FaPhoneAlt, 
  FaGlobe, 
  FaMapMarkedAlt,
  FaCar,      // 新增：用於交通資訊
  FaRoute     // 新增：用於路徑描述
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dryichen.com.tw';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '新竹復健科推薦-林羿辰醫師｜專業PRP注射、震波治療｜宸新復健科診所院長',
    template: '%s | 林羿辰醫師'
  },
  description: '台大醫院林羿辰醫師官方網站。現任新竹宸新復健科診所院長，擁有健身教練證照的復健科醫師。專長：高解析超音波導引PRP注射、增生療法、震波治療、兒童骨齡評估與減重門診。',
  keywords: [
    '林羿辰醫師', '林羿辰', '運動教練醫師', '新竹復健科醫師推薦',
    '新竹復健科', '宸新復健科', 'PRP注射', '震波治療', '兒童骨齡', '減重門診',
    '新竹科學園區', '關埔重劃區',
    '新竹東區復健科', '新竹科學園區物理治療', '竹北增生療法', '光復路復健診所'
  ],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: '林羿辰醫師-宸新復健科診所院長',
    description: '台大醫師林羿辰，結合醫學與運動訓練，提供最專業的骨科復健與疼痛治療應用.',
    type: 'profile',
    url: SITE_URL,
    siteName: '林羿辰醫師',
    images: [
      {
        url: '/images/main/a.webp',
        width: 1200,
        height: 630,
        alt: '林羿辰醫師',
      },
    ],
    locale: 'zh_TW',
  },
}

// --- Schema 資料更新 ---
const medicalClinicSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  '@id': `${SITE_URL}/#clinic`,
  name: '宸新復健科診所',
  alternateName: '林羿辰醫師診所',
  description: '由台大醫師林羿辰院長親自看診，提供PRP注射、震波治療、一對一運動治療等服務。',
  image: `${SITE_URL}/images/main/b.webp`,
  logo: `${SITE_URL}/images/logo.webp`,
  url: SITE_URL,
  datePublished: '2026-01-25',
  dateModified: '2026-02-25',
  telephone: '+886-3-564-7999',
  priceRange: '$$', 
  address: {
    '@type': 'PostalAddress',
    streetAddress: '光復路一段371號B1',
    addressLocality: '新竹市',
    addressRegion: '東區',
    postalCode: '300',
    addressCountry: 'TW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '24.7833314', 
    longitude: '121.0170937'
  },
  sameAs: [
    "https://www.facebook.com/DrYiChen", 
    "https://www.instagram.com/dryichen/",
    "https://www.threads.net/@dryichen",
    "https://youtube.com/@dryichen"
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '21:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '12:00' }
  ],
  medicalSpecialty: ['Physical Medicine and Rehabilitation', 'Orthopedics', 'Pediatrics'],
  physician: {
    '@type': 'Physician',
    name: '林羿辰',
    jobTitle: '院長',
    image: `${SITE_URL}/images/main/a.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '光復路一段371號B1',
      addressLocality: '新竹市',
      addressRegion: '東區',
      postalCode: '300',
      addressCountry: 'TW',
    },
    alumniOf: { 
      '@type': 'EducationalOrganization', 
      name: '國立台灣大學醫學系' 
    },
    medicalSpecialty: [
      'Physical Medicine and Rehabilitation',
      'SportsMedicine'
    ],
 
  'sameAs': [
    'https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
    'https://www.pmr.org.tw/associator/associator-all.asp?w/',
    'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a='
  ],
  // 專業證照 (Credentials)：GEO (AI 搜尋) 判斷可信度的鐵證
  'hasCredential': [
    {
      '@type': 'EducationalOccupationalCredential',
      'name': '醫事人員執業資格',
      'credentialCategory': '醫師證書',
      'url': 'https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
      'recognizedBy': {
        '@type': 'Organization',
        'name': '中華民國衛生福利部'
      }
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': '復健科專科醫師資格',
      'credentialCategory': '復健科專科醫師證書',
      'url': 'https://www.pmr.org.tw/associator/associator-all.asp?w/',
      'recognizedBy': {
        '@type': 'Organization',
        'name': '台灣復健醫學會'
      }
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': '骨質疏鬆症學會專科醫師資格',
      'credentialCategory': '骨質疏鬆症學會專科醫師證書',
      'url': 'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a=',
      'recognizedBy': {
        '@type': 'Organization',
        'name': '中華民國骨質疏鬆症學會'
      }
    }
  ],

  "hasMap": "https://www.google.com/maps/search/?api=1&query=宸新復健科診所",
  "areaServed": [
    {
      "@type": "City",
      "name": "新竹市"
    },
    {
      "@type": "Place",
      "name": "新竹科學園區"
    },
    {
      "@type": "Place",
      "name": "關埔重劃區",
      "geo": {
          "@type": "GeoCircle",
          "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "24.7833314",
              "longitude": "121.0170937"
          },
          "geoRadius": "5000"
      }
    },
    {
      "@type": "City",
      "name": "竹北市"
    },
    {
      "@type": "AdministrativeArea",
      "name": "新竹縣"
    }
  ] },

  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.6',
    reviewCount: '706',
    bestRating: '5',
    worstRating: '1'
  },
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://reg.forcestar.com.tw/appointment/7/reserve',
      inLanguage: 'zh-TW',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
        'http://schema.org/IOSPlatform',
        'http://schema.org/AndroidPlatform'
      ]
    },
    result: {
      '@type': 'MedicalAppointment',
      name: '網路掛號'
    }
  }
}

// ✨ FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "請問宸新復健科診所好停車嗎？有無障礙設施嗎？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "有的，宸新復健科診所備有專屬平面停車位供看診民眾使用，解決您在新竹市區找車位的困擾。此外，診所全區設有完善的無障礙空間，無論是行動不便的長輩或使用輪椅的患者，都能輕鬆進出就診。"
    }
  }, {
    "@type": "Question",
    "name": "林羿辰醫師的治療有什麼特色？什麼是「運動教練醫師」？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "林羿辰院長同時擁有復健專科與骨鬆專科雙執照，並考取美國 ACE-CPT 私人教練證照。治療特色是「醫學結合訓練」，除了使用高解析超音波導引進行 PRP 增生療法或震波治療外，更會指導正確發力模式，從根源預防運動傷害復發。"
    }
  }, {
    "@type": "Question",
    "name": "看診需要預約嗎？可以現場掛號嗎？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "為了節省您的寶貴時間，建議使用網路預約掛號。診所雖接受現場掛號，但預約民眾享有優先看診權益。您可以透過官網預約按鈕或官方 LINE 完成掛號。"
    }
  }]
}

export default function Home() {
  const latestNews = [...newsList]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const displayNews = [...latestNews, ...latestNews];

  return (
    <>
      <JsonLd data={medicalClinicSchema} />
      <JsonLd data={faqSchema} />
      <ScrollAnimation />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
            white-space: nowrap;
            display: flex;
            width: max-content;
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .animate-swing {
          animation: swing 2s infinite ease-in-out;
          display: inline-block;
        }
      `}} />
      
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300 font-sans antialiased selection:bg-cyan-500/30">
        <main className="flex-grow relative pt-0">
          
          {/* 最新內容速報欄位 */}
          <section className="container mx-auto px-4 mb-4 md:mb-0 relative z-20 -mt-6 md:-mt-10 animate-on-scroll">
            <div className="max-w-5xl mx-auto bg-slate-800/80 backdrop-blur border-l-4 border-pink-500 rounded-r-lg shadow-lg p-3 flex items-center gap-3 md:gap-4 hover:bg-slate-800 transition-colors">
                <div className="bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full text-sm font-bold flex items-center shrink-0 border border-pink-500/20 z-10">
                    <FaBell className="mr-2 animate-swing" />最新消息
                </div>
                <div className="flex-grow min-w-0 overflow-hidden relative h-6 mask-linear-fade">
                    <div className="animate-marquee absolute top-0 left-0 flex gap-12 items-center h-full">
                        {displayNews.map((news, index) => (
                            <Link key={`${news.id}-${index}`} href={`/about/news/${news.id}`} className="text-slate-200 hover:text-cyan-400 transition-colors flex items-center whitespace-nowrap text-sm md:text-base font-medium">
                                <span className="text-yellow-400 font-bold mr-2 text-xs border border-yellow-400/30 px-1 rounded">NEW</span>
                                <span className="text-slate-400 mr-2 text-sm">[{news.date}]</span>
                                {news.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <Link href="/about/news" className="text-sm text-slate-400 hover:text-white shrink-0 hidden md:flex items-center group z-10 bg-slate-800/50 px-2 rounded">
                    查看更多 <FaChevronRight className="text-[10px] ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </section>

          {/* Section 1: 醫師介紹 */}
          <section className="container mx-auto px-4 pt-4 pb-8 md:pt-6 md:pb-8 animate-on-scroll delay-100">
              <div className="max-w-6xl mx-auto">
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2 relative">
                      <div className="h-full w-full min-h-[320px] md:min-h-[550px] relative overflow-hidden group">
  <Link href="/about/doctors" className="block h-full w-full cursor-pointer">
    <Image 
      src="/images/main/a.webp"
      alt="新竹復健科推薦-林羿辰醫師-台大雙專科院長" 
      fill
      priority
      loading="eager"
      fetchPriority="high"
      className="object-cover object-center md:object-bottom group-hover:scale-105 transition-all duration-700"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </Link>
</div>
                      </div>

                      <div className="md:w-1/2 p-8 md:p-8 flex flex-col justify-center relative z-10">
                      <h1 className="text-5xl md:text-6xl font-bold font-sans text-white mb-2 tracking-wide">
  <Link 
    href="/about/doctors" 
    className="hover:text-cyan-300 transition-all duration-300 cursor-pointer group"
  >
    林羿辰 <span className="text-cyan-400 group-hover:text-cyan-300">醫師</span>
  </Link>
</h1>
                          <p className="text-2xl text-slate-300 mb-6 font-medium">運動教練醫師 | 骨科復健專家</p>
                          <h2 className="text-2xl md:text-3xl text-cyan-400 font-medium mb-8 border-l-4 border-cyan-500 pl-4 flex flex-wrap items-center gap-2">
                            新竹增生療法專家 <span className="text-xl md:text-2xl text-slate-400 font-normal">| 兒童早療評估</span>
                          </h2>
                          <div className="space-y-8 md:space-y-6">
                            <div>
                               <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-wider mb-3 border-b border-slate-700 pb-1 inline-block flex items-center">
                                 <FaGraduationCap className="mr-2" />學歷與資格
                               </h3>
                               <ul className="space-y-2 text-slate-300 text-xl">
                                  <li className="flex items-start"><span className="text-cyan-500 mr-2">▹</span>國立台灣大學醫學系</li>
                                  <li className="flex items-start"><span className="text-cyan-500 mr-2">▹</span>雙專科醫師 (復健專科 + 骨鬆專科)</li>
                                  <li className="flex items-start"><span className="text-cyan-500 mr-2">▹</span>ACE-CPT 美國運動學會國際私人教練認證</li>
                               </ul>
                            </div>
                            <div>
                               <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-wider mb-3 border-b border-slate-700 pb-1 inline-block flex items-center">
                                 <FaBriefcase className="mr-2" />經歷
                               </h3>
                               <ul className="space-y-2 text-slate-300 text-xl">
                                  <li className="flex items-start"><span className="text-cyan-500 mr-2">▹</span>新竹馬偕紀念醫院 主治醫師</li>
                                  <li className="flex items-start"><span className="text-cyan-500 mr-2">▹</span>台灣增生療法醫學會 (TAPRM) 會員</li>
                                  <li className="flex items-start"><span className="text-cyan-500 mr-2">▹</span>台灣大學網球校隊</li>
                               </ul>
                            </div>
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-700/50">
                             <Link href="/about/doctors" className="inline-flex items-center text-cyan-400 font-bold hover:text-white transition-colors group/link text-lg">
                                了解完整醫師資歷 <FaArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                             </Link>
                          </div>
                      </div>
                    </div>
                </div>
              </div>
          </section>

          {/* Section 2: 診所資訊 */}
          <section className="container mx-auto px-4 pb-4 animate-on-scroll delay-80">
              <div className="max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                   <span className="bg-cyan-500/20 text-cyan-400 p-3 rounded-lg border border-cyan-500/30 flex items-center justify-center">
                     <FaHospital className="text-2xl" />
                   </span>
                   <h2 className="text-4xl font-bold font-sans text-white">診所資訊</h2>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8 mb-12 shadow-lg backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                   <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
                       
                       <div className="lg:w-4/12 w-full flex-shrink-0">
                        <div className="w-full h-full relative aspect-[9/16] rounded-xl overflow-hidden border border-slate-600 shadow-xl bg-black">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/asqbvbEukOM" 
                            srcDoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}img{height:100%;object-fit:cover}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/asqbvbEukOM?autoplay=1><img src=https://i.ytimg.com/vi/asqbvbEukOM/frame0.jpg alt='宸新復健科介紹'><span>▶</span></a>"
                            title="宸新復健科介紹" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                            loading="lazy"
                          ></iframe>
                        </div>
                      </div>

                       <div className="lg:w-8/12 flex flex-col justify-between h-auto py-1">
                           <div className="flex flex-col gap-5">
                              <h3 className="text-4xl font-bold text-white flex flex-wrap items-center justify-between gap-4">
                                  新竹市宸新復健科
                                  <Link href="/about/clinic" className="text-base text-cyan-500 font-normal hover:underline decoration-cyan-500/50 underline-offset-4 flex items-center whitespace-nowrap">
                                      查看設備介紹 <FaArrowRight className="text-xs ml-1" />
                                  </Link>
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-slate-700 pb-6">
                                 <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400 text-sm gap-0.5">
                                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                    <span className="text-slate-300 font-bold">4.7</span>
                                    <span className="text-slate-500 text-sm">(700+ 評論)</span>
                                 </div>
                                 <div className="hidden sm:block w-px h-6 bg-slate-600"></div>
                                 <div className="flex flex-wrap gap-3">
                                 <Link 
  href="/about/clinic/parking" 
  className="text-sm bg-cyan-900/40 border border-cyan-500/30 text-cyan-100 px-3 py-1.5 rounded-md flex items-center hover:bg-cyan-900/60 transition-colors cursor-pointer"
>
  <FaParking className="mr-2 text-yellow-400" />
  專屬停車位
</Link>
                                    <span className="text-sm bg-cyan-900/40 border border-cyan-500/30 text-cyan-100 px-3 py-1.5 rounded-md flex items-center">
                                         <FaWheelchair className="mr-2 text-blue-400" />無障礙空間(電梯)
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div className="grid md:grid-cols-2 gap-8 my-6">
                             <div className="flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-cyan-400 mb-5 font-sans border-l-4 border-cyan-500 pl-3">診所特色項目</h3>
                                <ul className="space-y-4 text-slate-300 text-lg">
                                  <li className="flex items-center"><FaCircle className="text-cyan-500 mr-3 text-[10px]" />醫學中心級數位X光機</li>
                                  <li className="flex items-center"><FaCircle className="text-cyan-500 mr-3 text-[10px]" />頂規高畫質超音波檢查</li>
                                  <li className="flex items-center"><FaCircle className="text-cyan-500 mr-3 text-[10px]" />台大醫師團隊親自看診</li>
                                </ul>
                             </div>
                             <div className="flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-pink-400 mb-5 font-sans border-l-4 border-pink-500 pl-3">診所特色治療</h3>
                                <ul className="space-y-4 text-slate-300 text-lg">
                                  <li className="flex items-center"><FaCircle className="text-pink-500 mr-3 text-[10px]" />瑞士進口聚焦式震波</li>
                                  <li className="flex items-center"><FaCircle className="text-pink-500 mr-3 text-[10px]" />PRP 高濃度血小板再生</li>
                                  <li className="flex items-center"><FaCircle className="text-pink-500 mr-3 text-[10px]" />兒童早療 (PT/OT/ST)</li>
                                  <li className="flex items-center"><FaCircle className="text-pink-500 mr-3 text-[10px]" />增生療法注射</li>
                                </ul>
                             </div>
                           </div>

                           <div className="bg-slate-900/40 p-6 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors mt-auto">
                              <div className="flex flex-col gap-5">
                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-3">
                                       <div className="flex items-start gap-3 text-slate-200 text-lg font-medium">
                                            <HiLocationMarker className="mt-1.5 text-cyan-400 text-xl shrink-0" />
                                            <p>300新竹市東區光復路一段371號B1 <span className="text-slate-300 text-base block sm:inline ml-0 sm:ml-2">(近竹科/關新路)</span></p>
                                       </div>
                                       <div className="flex items-center gap-3 text-slate-200 text-lg font-medium">
                                            <FaPhoneAlt className="text-cyan-400 shrink-0" />
                                            {/* 確保電話格式 NAP 一致性 */}
                                            <a href="tel:+886-3-564-7999" className="tracking-wide text-xl font-bold hover:text-cyan-400 transition-colors">
                                              (03) 564-7999
                                            </a>
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0">
                                       <a href="https://www.forcestar.com.tw/clinic/%E6%96%B0%E7%AB%B9%E7%AB%B9%E7%A7%91%E5%AE%B8%E6%96%B0%E5%BE%A9%E5%81%A5%E7%A7%91%E8%A8%BA%E6%89%80/c/jvAUv7dDKT" target="_blank" rel="noopener noreferrer" className="w-full md:w-72 text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-medium whitespace-nowrap flex items-center justify-center gap-2">
                                            <FaGlobe />新竹復健科首選 - 宸新復健科診所
                                       </a>
                                       {/* 替換為正確的 Google Maps 連結 */}
                                       <a href="https://www.google.com/maps/search/?api=1&query=宸新復健科診所" target="_blank" rel="noopener noreferrer" className="w-full md:w-72 text-center px-5 py-3 bg-slate-700 text-white rounded-lg transition-all font-medium flex items-center justify-center border border-slate-600 gap-2">
                                            <FaMapMarkedAlt className="text-cyan-400" /> Google 地圖
                                       </a>
                                    </div>
                                 </div>
                              </div>
                           </div>
                       </div>
                   </div>
                </div>

                {/* ✨ 新增：交通指引與位置區塊 - 針對 Local SEO 優化 */}
                <div className="grid md:grid-cols-3 gap-6 mb-12 animate-on-scroll delay-150">
                   <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4 text-cyan-400 font-bold text-lg">
                         <FaCar className="text-2xl" /> 國道一號 (新竹交流道)
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        下新竹交流道後，請往「光復路/竹東」方向行駛。沿光復路一段直行約 1.5 公里，診所位於您的右側（元大期貨旁）。
                      </p>
                   </div>
                   <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4 text-cyan-400 font-bold text-lg">
                         <FaRoute className="text-2xl" /> 新竹科學園區
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        由園區一路或介壽路出口離開園區，轉光復路一段往竹東方向。直行約 500 公尺即可抵達，診所提供優質的園區復健服務。
                      </p>
                   </div>
                   <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4 text-cyan-400 font-bold text-lg">
                         <FaMapMarkedAlt className="text-2xl" /> 關新路商圈
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        沿關新路往光復路方向行駛，於光復路一段路口右轉即達。診所備有<span className="text-yellow-400 font-bold">專屬平面停車位</span>，看診停車免煩惱。
                      </p>
                   </div>
                </div>

              </div>
          </section>
        </main>
      </div>
    </>
  )
}