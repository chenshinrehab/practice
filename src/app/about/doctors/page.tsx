// src/app/about/doctors/page.tsx
import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Image from 'next/image'
import ClinicHoursModal from '@/components/ClinicHoursModal'
// ✨ 1. 引入動畫組件
import ScrollAnimation from '@/components/ScrollAnimation'

const SITE_URL = 'https://www.dryichen.com.tw'
const PAGE_PATH = '/about/doctors'
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`

// ==========================================
// 1. Meta 設定 (優化 Title、加入 Geo 與 OG)
// ==========================================
export const metadata: Metadata = { 
  // 修正：僅提供標題，讓 layout.tsx 的模板加上「 | 新竹宸新復健科」避免重複
  title: '林羿辰醫師介紹 - 台大雙專科院長 | 新竹復健科/骨科/運動傷害推薦 | 新竹宸新復健科',
  description: '新竹復健科推薦林羿辰醫師。台大醫學系畢業，具備復健專科與骨質疏鬆專科雙資格。專精超音波導引PRP注射、增生療法、兒童骨齡評估與各類運動傷害治療，是您值得信賴的骨科復健專家。',
  keywords: ['林羿辰', '新竹復健科醫師', '台大醫師', '新竹骨科推薦', '運動醫學', 'PRP注射', '增生療法', '超音波導引', '兒童骨齡'],
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: '林羿辰醫師介紹 - 台大雙專科院長 | 新竹宸新復健科',
    description: '新竹復健科推薦林羿辰醫師。台大醫學系畢業，具備復健專科與骨質疏鬆專科雙資格。',
    url: CANONICAL_URL,
    type: 'profile',
    images: [`${SITE_URL}/images/doctor/c.webp`],
    siteName: '新竹宸新復健科診所',
  },
  // 加入在地化標記
  other: {
    'geo.region': 'TW-HCH',
    'geo.placename': '新竹市',
  }
}

export default function DoctorsPage() {
  const currentUrl = CANONICAL_URL

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '關於我們', item: `${SITE_URL}/about` },
      { '@type': 'ListItem', position: 3, name: '醫師團隊', item: currentUrl },
    ],
  }

  const jsonLdPhysicianPage = {
    '@context': 'https://schema.org',
    // 核心類型：標註這是一個專業的醫療網頁
    '@type': 'MedicalWebPage',
    '@id': `${currentUrl}#webpage`,
    'url': currentUrl,
    'name': '林羿辰 醫師介紹 | 宸新復健科診所院長',
    'description': '新竹宸新復健科院長林羿辰醫師，台大雙專科背景，專精復健醫學、骨質疏鬆症、超音波導引 PRP 注射與各種運動傷害精準治療。',
    datePublished: '2026-01-25',
    dateModified: '2026-02-25',
    // 1. 作者區塊 (Author)：醫療 SEO 的權威核心
    // 強烈建議使用「醫師個人」作為作者，而非診所
    'author': {
      '@type': 'Physician',
      'name': '林羿辰 醫師',
      'jobTitle': '院長',
      'url': `${SITE_URL}/about/doctors`,
      'image': `${SITE_URL}/images/main/a.webp`,
      'gender': 'Male',
      // 學歷背景：強化 EEAT
      'alumniOf': {
        '@type': 'EducationalOrganization',
        'name': '國立台灣大學醫學系'
      },
      // 醫師實體唯一識別連結 (SameAs)：修正 URL 編碼確保 100% 爬取成功
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
      ]
    },
  
    // 2. 發佈者區塊 (Publisher)：標註為正式醫療機構
    'publisher': {
      '@type': 'MedicalClinic',
      'name': '宸新復健科診所',
      'url': SITE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/logo.webp`
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '光復路一段371號B1',
        'addressLocality': '新竹市',
        'addressRegion': '東區',
        'postalCode': '300',
        'telephone': '+886-3-5647999',
        'addressCountry': 'TW'
      }
    },
  
    // 3. 頁面主要實體 (MainEntity)：將網頁焦點精確錨定在林醫師身上
    'mainEntity': {
      '@type': 'Physician',
      'name': '林羿辰',
      'jobTitle': '院長',
      'image': `${SITE_URL}/images/doctor/c.webp`,
      'description': '台大醫學系畢業，具備復健科專科與骨鬆雙專科醫師資歷。專精超音波導引PRP注射與運動傷害治療。',
      'telephone': '+886-3-5647999',
      'priceRange': '$$',
      'url': `${SITE_URL}/about/doctors`,
      
      // 專業技能分類：GEO 搜尋匹配 (AI 推薦關鍵字)
      'medicalSpecialty': [
        { '@type': 'MedicalSpecialty', 'name': 'Physical Medicine and Rehabilitation' },
        { '@type': 'MedicalSpecialty', 'name': 'Sports Medicine' },
        { '@type': 'MedicalSpecialty', 'name': 'Orthopedics' }
      ],
  
      // 在地服務地點
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '光復路一段371號B1',
        'addressLocality': '新竹市',
        'addressRegion': '東區',
        'postalCode': '300',
        'addressCountry': 'TW'
      },
      
      // 醫師隸屬診所
      'worksFor': {
        '@type': 'MedicalClinic',
        'name': '宸新復健科診所',
        'url': SITE_URL,
        'telephone': '+886-3-5647999',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '光復路一段371號B1',
          'addressLocality': '新竹市',
          'addressRegion': '東區',
          'postalCode': '300',
          'addressCountry': 'TW'
        }
      },
  
      // 地理座標：強化 Google Map 關聯與 Local SEO
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '24.7833314', 
        'longitude': '121.0170937'
      }
    }
  }
  // ✨ 新增 FAQ 的 JSON-LD 結構化資料，大幅提升 Google SGE 與 AI 抓取機率
  const jsonLdFAQPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '為什麼選擇林羿辰醫師？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '林醫師為台大醫學系畢業並接受完整醫學訓練，具備國家認證之復健專科醫師資格。從醫以來經手超過10萬名個案，具備極為豐富的臨床經驗。'
        }
      },
      {
        '@type': 'Question',
        name: '為什麼運動傷害要找林醫師？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '林醫師本身熱愛運動，擅長網球與健身，擁有健身教練執照及校隊經歷，亦成立了一支業餘籃球隊。對於各種運動傷害有深刻的親身經歷，加上門診中有大量滑雪、攀岩及各類賽事受傷的運動族群，因此能以專業且感同身受的角度提供最適合的治療。'
        }
      },
      {
        '@type': 'Question',
        name: '為什麼增生注射或 PRP 要找林醫師？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '林醫師堅持使用高規格超音波儀器，搭配精準的超音波導引注射技術，將藥劑準確送達受傷部位以發揮最佳療效。無論是腳踝扭傷、韌帶與半月板受傷、網球肘等各類運動傷害，或是各種退化性關節炎，皆擁有豐富且成功的治療經驗。'
        }
      }
    ]
  }

  return (
    <>
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdPhysicianPage} />
      <JsonLd data={jsonLdFAQPage} />
      
      {/* ✨ 2. 放置動畫觸發器 */}
      <ScrollAnimation />
      
      <div className="min-h-screen bg-slate-900 text-slate-300 pt-0 -mt-10 md:-mt-12 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* ✨ 3. 返回按鈕動畫 */}
          <div className="animate-on-scroll">
            <Link href="/about" className="inline-flex items-center text-cyan-400 mb-8 hover:text-cyan-300 transition-colors group">
                <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 返回關於我們
            </Link>
          </div>

          <section>
                {/* ✨ 4. 整張醫師名片大區塊加上進場動畫 */}
                <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative animate-on-scroll delay-100">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                   
                   <div className="flex flex-col lg:flex-row items-center">
                      
                      {/* 照片區域：增加稍微明顯的延遲 */}
                      <div className="w-full lg:w-[40%] relative aspect-[9/16] shrink-0 bg-slate-800 self-start animate-on-scroll delay-200">
  <Image 
    src="/images/doctor/c.webp"
    alt="新竹復健科推薦醫師：林羿辰院長 - 台大醫學系雙專科背景" 
    fill 
    priority 
    // @ts-ignore
    fetchPriority="high" 
    className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-700" 
    sizes="(max-width: 1024px) 100vw, 40vw" 
  />
  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-900/30 pointer-events-none"></div>
</div>

                      {/* 文字區域 */}
                      <div className="w-full lg:w-[60%] p-8 flex flex-col justify-center relative z-10 animate-on-scroll delay-300">
                          
                          <div className="mb-6">
                             <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-3 tracking-wide leading-tight">
                                林羿辰 <span className="text-2xl text-cyan-400 font-medium ml-1 whitespace-nowrap">醫師</span>
                             </h1>
                             {/* ✨ 補強 H2：強化專業形象與關鍵字權重 */}
                             <h2 className="text-xl text-slate-300 border-l-4 border-cyan-500 pl-4 mb-2">
                               新竹宸新復健科診所院長：專業PRP注射、猛健樂與兒童骨齡
                             </h2>
                             <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-700/50">台大醫學系</span>
                                <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-700/50">雙專科</span>
                                <span className="text-xs bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded border border-cyan-700/50">教練醫師</span>
                             </div>
                          </div>

                          <div className="mb-8 text-slate-300 text-base lg:text-lg leading-relaxed space-y-4">
                             <p>
                                林羿辰醫師畢業於<strong className="text-cyan-400 font-normal">國立台灣大學醫學系</strong>，曾任職於<strong className="text-cyan-400 font-normal">馬偕紀念醫院</strong>。
                             </p>
                             <p>
                                具備<strong className="text-cyan-400 font-normal">復健專科</strong>與<strong className="text-cyan-400 font-normal">骨質疏鬆專科</strong>雙重專科，並持有<strong className="text-cyan-400 font-normal">美國運動學會 (ACE-CPT)</strong> 國際私人教練證照。
                             </p>
                             <p>
                                專長於<strong>超音波導引注射</strong>、<strong>增生療法</strong>、各類<strong>運動傷害</strong>及<strong>兒童生長發育</strong>評估。
                             </p>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div>
                                <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-3 border-b border-slate-700 pb-2 flex items-center">
                                    <i className="fa-solid fa-star mr-2"></i> 主治專長
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['超音波導引注射', 'PRP 高濃度血小板', '增生療法', '兒童生長評估', '運動傷害治療'].map((item, idx) => (
                                        <span key={idx} className="bg-slate-700/50 hover:bg-cyan-900/30 text-slate-200 hover:text-cyan-300 px-3 py-1.5 rounded-full text-sm transition-colors border border-slate-600 hover:border-cyan-500/50 cursor-default">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-3 border-b border-slate-700 pb-2 flex items-center">
                                        <i className="fa-solid fa-graduation-cap mr-2"></i> 學歷與資格
                                    </h3>
                                    <ul className="space-y-2 text-slate-300 text-base">
                                      <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-1 text-xs">●</span>台大醫學系畢業</li>
                                      <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-1 text-xs">●</span>復健科專科醫師</li>
                                      <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-1 text-xs">●</span>ACE-CPT 美國私人教練</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider mb-3 border-b border-slate-700 pb-2 flex items-center">
                                        <i className="fa-solid fa-briefcase mr-2"></i> 專業經歷
                                    </h3>
                                    <ul className="space-y-2 text-slate-300 text-base">
                                      <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-1 text-xs">●</span>馬偕醫院主治醫師</li>
                                      <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-1 text-xs">●</span>台灣增生療法醫學會</li>
                                      <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-1 text-xs">●</span>台大網球校隊</li>
                                    </ul>
                                </div>
                            </div>
                          </div>
                          
                          {/* ✨ 按鈕區塊 */}
                          <div className="mt-8 pt-5 border-t border-slate-700/50 flex flex-wrap gap-4 animate-on-scroll delay-500">
                              <Link 
                                href="/treatments" 
                                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-all duration-300 font-bold flex items-center gap-2 group shadow-lg shadow-cyan-500/20 cursor-pointer"
                              >
                                  <i className="fa-solid fa-stethoscope text-xl group-hover:scale-110 transition-transform"></i>
                                  查看治療項目
                              </Link>
                              
                              <ClinicHoursModal />
                          </div>

                      </div>
                   </div>
                </div>
          </section>

          {/* ✨ 新增：臨床與運動醫學經驗亮點區塊 (強化 Experience 第一手經驗) */}
          <section className="mt-12 animate-on-scroll delay-300">
              <div className="bg-gradient-to-r from-slate-800 to-cyan-900/30 border border-slate-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500"></div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <i className="fa-solid fa-user-doctor text-cyan-400 mr-3"></i> 豐富臨床與運動醫學經驗
                  </h2>
                  {/* 改為 flex-col 並增加垂直間距 space-y-4，讓內容分為上下兩行 */}
                  <div className="flex flex-col space-y-4 text-slate-300 leading-relaxed text-lg">
                      <p>
                          從醫以來已<strong className="text-cyan-400 font-normal">經手超過 10 萬案例</strong>，超音波導引注射韓包含PRP<strong className="text-cyan-400 font-normal">一年超過五千案例</strong>，具備極為豐富的臨床診斷及精準注射經驗。
                      </p>
                      <p>
                          同時也是許多<strong className="text-cyan-400 font-normal">新竹地區職業與業餘球員指名的專屬醫師</strong>，熟稔各項運動，擅長且對各種運動傷害的預防與治療擁有豐富的臨床成功實績。
                      </p>
                  </div>
              </div>
          </section>
{/* 區塊 1：左右滑動證書欄 */}
<section className="mt-12 animate-on-scroll delay-400">
  <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl overflow-hidden">
    <h2 className="text-2xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-3 flex items-center">
      <i className="fa-solid fa-award mr-3"></i> 專業認證資歷
    </h2>
    
    {/* 容器使用 items-end 讓直橫混合時齊底對齊，視覺更穩重 */}
    <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-slate-800 snap-x items-end">
      {[
        { src: '/images/doctor/certificate/certificate1.webp', alt: '林羿辰醫師 - 中華民國復健科專科醫師證書', label: '復健科專科醫師證書', isPortrait: true },
        { src: '/images/doctor/certificate/certificate7.webp', alt: '林羿辰醫師 - 中華民國骨鬆專科醫師證書', label: '骨鬆專科醫師證書', isPortrait: false},
        { src: '/images/doctor/certificate/certificate2.webp', alt: '林羿辰醫師 - 國立台灣大學醫學系成績優良獎狀', label: '台大醫學成績優良獎', isPortrait: false },
        { src: '/images/doctor/certificate/certificate3.webp', alt: '林羿辰醫師 - 美國運動醫學會 ACE-CPT 國際私人教練證照', label: 'ACE-CPT 國際教練證照', isPortrait: false },
        { src: '/images/doctor/certificate/certificate4.webp', alt: '林羿辰醫師 - 國立台灣大學醫學系畢業證書', label: '台大醫學系畢業證書', isPortrait: false },
        { src: '/images/doctor/certificate/certificate5.webp', alt: '林羿辰醫師 - 肌肉骨骼超音波訓練認證證書', label: '超音波認證', isPortrait: true },
        { src: '/images/doctor/certificate/certificate6.webp', alt: '林羿辰醫師 - 中華民國醫師證書', label: '醫師證書', isPortrait: true },
      ].map((cert, index) => (
        /* 使用 figure 標籤封裝圖片與說明 */
        <figure key={index} className={`flex-shrink-0 snap-center ${cert.isPortrait ? 'w-[180px] md:w-[220px]' : 'w-[260px] md:w-[320px]'}`}>
          
          {/* 圖片容器：動態長寬比 */}
          <div className={`relative w-full overflow-hidden rounded-lg border border-slate-600 bg-slate-900 shadow-md ${cert.isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
            <Image 
              src={cert.src} 
              alt={cert.alt} // AI 抓取的關鍵：alt 包含醫師姓名與證書全名
              fill 
              className="object-cover hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* 語意化說明：讓搜尋引擎與輔助工具精確連結圖文 */}
          <figcaption className="text-xs text-slate-400 mt-2 text-center bg-slate-900/30 py-2 rounded truncate px-2 border border-slate-700/50">
            {cert.label}
          </figcaption>
          
        </figure>
      ))}
    </div>
    <p className="text-slate-500 text-xs mt-2 text-right">← 左右滑動檢視更多 →</p>
  </div>
</section>


          {/* ✨ 新增：常見問答 FAQ (配合頂部的 JSON-LD) */}
          <section className="mt-12 animate-on-scroll delay-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <i className="fa-regular fa-circle-question text-cyan-400 mr-3"></i> 常見問答 FAQ
              </h2>
              <div className="space-y-4">
                  {/* Q1 */}
                  <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-cyan-300 mb-3">為什麼選擇林羿辰醫師？</h3>
                      <p className="text-slate-300 leading-relaxed">
                          林醫師為台大醫學系畢業並接受完整醫學訓練，具備國家認證之復健專科醫師資格。從醫以來經手超過10萬名個案，具備極為豐富的臨床經驗。
                      </p>
                  </div>
                  {/* Q2 */}
                  <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-cyan-300 mb-3">為什麼運動傷害要找林醫師？</h3>
                      <p className="text-slate-300 leading-relaxed">
                          林醫師本身熱愛運動，擅長網球與健身，擁有健身教練執照及校隊經歷，亦成立了一支業餘籃球隊。對於各種運動傷害有深刻的親身經歷，加上門診中有大量滑雪、攀岩及各類賽事受傷的運動族群，因此能以專業且感同身受的角度提供最適合的治療。
                      </p>
                  </div>
                  {/* Q3 */}
                  <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-cyan-300 mb-3">為什麼增生注射或 PRP 要找林醫師？</h3>
                      <p className="text-slate-300 leading-relaxed">
                          林醫師堅持使用高規格超音波儀器，搭配精準的超音波導引注射技術，將藥劑準確送達受傷部位以發揮最佳療效。無論是腳踝扭傷、韌帶與半月板受傷、網球肘等各類運動傷害，或是各種退化性關節炎，皆擁有豐富且成功的治療經驗。
                      </p>
                  </div>
              </div>
          </section>


{/* 區塊 3：權威連結查詢 */}
<section className="mt-8 animate-on-scroll delay-400">
    {/* 減少上下邊界 py-4 */}
    <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl px-8 py-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* 標題部分 */}
            <h3 className="text-2xl font-bold text-white flex items-center shrink-0">
                <i className="fa-solid fa-link text-cyan-400 mr-3"></i> 
                官方資格驗證
            </h3>

            {/* 按鈕群組：透過 flex 與 gap 讓兩個按鈕整齊排列 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full lg:w-auto">
                {/* 連結 1 */}
                <a 
    href="https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%3D%3D" 
    target="_blank" 
    rel="noopener" 
    className="flex items-center justify-center px-8 py-3 rounded-lg bg-slate-800 hover:bg-cyan-900/60 text-cyan-400 border border-slate-600 transition-all font-medium group min-w-[220px]"
>
    <i className="fa-solid fa-hospital-user text-lg mr-3 group-hover:scale-110 transition-transform"></i>
    <span className="text-sm">衛生福利部查詢</span>
</a>

                {/* 連結 2 */}
                <a 
    href="https://www.pmr.org.tw/associator/associator-all.asp?w/" 
    target="_blank" 
    rel="noopener" 
    className="flex items-center justify-center px-8 py-3 rounded-lg bg-slate-800 hover:bg-cyan-900/60 text-cyan-400 border border-slate-600 transition-all font-medium group min-w-[220px]"
>
    <i className="fa-solid fa-user-doctor text-lg mr-3 group-hover:scale-110 transition-transform"></i>
    <span className="text-sm">復健醫學會查詢</span>
</a>

   {/* 連結 2 */}
   <a 
    href="https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a=" 
    target="_blank" 
    rel="noopener" 
    className="flex items-center justify-center px-8 py-3 rounded-lg bg-slate-800 hover:bg-cyan-900/60 text-cyan-400 border border-slate-600 transition-all font-medium group min-w-[220px]"
>
    <i className="fa-solid fa-user-doctor text-lg mr-3 group-hover:scale-110 transition-transform"></i>
    <span className="text-sm">骨鬆醫學會查詢</span>
</a>
            </div>
            
        </div>
    </div>
</section>
          
          {/* 區塊 2：學術發表與研究 */}
          <section className="mt-8 animate-on-scroll delay-400">
    {/* 調整 py-4 以減少上下邊界內距 (原為 p-8) */}
    <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl px-8 py-4 shadow-xl">
        {/* 使用 justify-between 讓標題與按鈕分居兩側，items-center 確保垂直對齊 */}
        <h3 className="text-2xl font-bold text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
                <i className="fa-solid fa-book-medical text-cyan-400 mr-3"></i> 
                學術發表與研究
            </div>
            
            <a 
    href="https://pubmed.ncbi.nlm.nih.gov/33327331/" 
    target="_blank" 
    rel="noopener" 
    className="inline-flex items-center px-6 py-2.5 bg-slate-800 hover:bg-cyan-900/60 text-cyan-400 rounded-lg text-sm border border-slate-600 transition-all font-medium group whitespace-nowrap ml-0 md:ml-6"
>
    <i className="fa-solid fa-up-right-from-square mr-2 group-hover:scale-110"></i> 
    前往 PubMed 檢視論文
</a>
        </h3>
    </div>
</section>

        </div>
      </div>
    </>
  )
}