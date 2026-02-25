// src/app/weight-bone/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { getWeightLossProgramBySlug, getAllWeightLossProgramSlugs } from '@/data/weightLoss'
import ShareButtons from '@/components/ShareButtons'
import { casesData } from '@/data/cases'

// 引入 React Icons (Font Awesome 6 版本)
import { FaCalculator, FaChartLine, FaBone, FaUtensils } from 'react-icons/fa6'

// 定義常數
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dryichen.com.tw'

interface PageProps {
  params: Promise<{
    slug: string

  }>
}

export async function generateStaticParams() {
  return getAllWeightLossProgramSlugs()
}

// 1. 動態 Meta 設定 (修正標題重複)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const program = getWeightLossProgramBySlug(slug)
  if (!program) return { title: '項目不存在' }

  const canonicalUrl = `${SITE_URL}/weight-bone/${slug}`

  // ✅ 核心修正：切除資料庫內手寫的後綴，交給 layout 模板處理，避免重複
  const baseTitle = program.seoTitle || program.title;
  const cleanTitle = baseTitle.split('|')[0].split('-')[0].trim();

  return {
    title: `${cleanTitle} | 新竹宸新復健科`,
    description: program.seoDescription || program.description,
    keywords: program.keywords || ['新竹減重', '瘦瘦針', '骨齡', '兒童生長'],
    
    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: program.title,
      description: program.seoDescription || program.description,
      url: canonicalUrl,
      type: 'article',
      images: program.images && program.images.length > 0 
        ? [
            {
              url: program.images[0].src.startsWith('http') 
                ? program.images[0].src 
                : `https://www.dryichen.com.tw${program.images[0].src}`,
              width: 1200,
              height: 630,
              alt: program.title,
            }
          ] 
        : [
            {
              url: 'https://www.dryichen.com.tw/images/og-default.jpg',
              width: 1200,
              height: 630,
            }
          ],
    }
  }
}

export default async function WeightBoneDetailPage({ params }: PageProps) {
  // 核心：解構並 await params 取得 slug
  const { slug } = await params
  const program = getWeightLossProgramBySlug(slug)
  if (!program) notFound()

  // 確保頁面內連結一致
  const currentPageUrl = `${SITE_URL}/weight-bone/${slug}`
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=ffffff&data=${encodeURIComponent(currentPageUrl)}`

  // 核心：泛用標籤比對邏輯 (自動帶入案例)
  const matchedCases = casesData.filter(c => {
    const pageTags = program.tags || [];
    const caseTags = c.tags || [];
    // 只要標籤陣列中有一個元素重疊，就顯示該案例
    return caseTags.some(tag => pageTags.includes(tag));
  }).slice(0, 6);

  // 2. Schema: 麵包屑
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '減重與骨齡', item: `${SITE_URL}/weight-bone` },
      { '@type': 'ListItem', position: 3, name: program.title, item: currentPageUrl },
    ],
  }

  // 3. Schema: 醫療服務 (Service)
  const jsonLdService = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    // 強化名稱，鎖定「新竹」、「門診」、「推薦」等高價值搜尋關鍵字
    'name': `新竹${program.title}門診推薦`, 
    'description': program.seoDescription || program.description,
    'url': currentPageUrl,
    
    // 圖片路徑自動補完邏輯，確保搜尋引擎抓得到圖
    'image': program.images && program.images.length > 0 
      ? program.images.map(img => img.src.startsWith('http') ? img.src : `${SITE_URL}${img.src}`) 
      : [`${SITE_URL}/images/main/a.webp`],
  
    // 具體服務類型，幫助 AI 引擎分類
    'serviceType': [
      'Medical Weight Loss', 
      'InBody Assessment', 
      'Weight Control', 
      'Physical Medicine', 
      'Rehabilitation Service'
    ],
  
    // 1. 作者/醫師區塊 (EEAT 核心：證照、學歷、外部權威連結)
    'author': {
      '@type': 'Physician',
      'name': '林羿辰 醫師',
      'jobTitle': '宸新復健科診所 院長',
      'url': `${SITE_URL}/about/doctors`,
      'image': `${SITE_URL}/images/main/a.webp`,
      'alumniOf': { 
        '@type': 'EducationalOrganization', 
        'name': '國立台灣大學醫學系' 
      },
      'medicalSpecialty': [
        'Physical Medicine and Rehabilitation',
        'Sports Medicine'
      ],
      // 外部權威資料庫連結，建立醫師實體（Entity）唯一性
      'sameAs': [
        'https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
        'https://www.pmr.org.tw/associator/associator-all.asp?w/',
        'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a='
      ],
      // 醫師證照：GEO (AI 搜尋) 評斷可信度的關鍵
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
  
    // 2. 內容時效性 (GEO 判斷新鮮度的關鍵)
    'datePublished': '2026-01-25',
    'dateModified': program.lastModified || '2026-02-25',
  
    // 3. 醫學專科與針對部位
    'medicalSpecialty': [
      { '@type': 'MedicalSpecialty', 'name': 'Physical Medicine and Rehabilitation' },
      { '@type': 'MedicalSpecialty', 'name': 'Orthopedics' },
      { '@type': 'MedicalSpecialty', 'name': 'Sports Medicine' }
    ],
    'bodyLocation': [
      { "@type": "AnatomicalStructure", "name": "Knee", "alternateName": "膝蓋" },
      { "@type": "AnatomicalStructure", "name": "Shoulder", "alternateName": "肩膀" },
      { "@type": "AnatomicalStructure", "name": "Elbow", "alternateName": "手肘" },
      { "@type": "AnatomicalStructure", "name": "Ankle", "alternateName": "足踝" }
    ],
    'howPerformed': "Ultrasound-guided injection (超音波導引注射)",
  
    // 4. 提供者資訊 (醫師個人背景)
    'provider': {
      '@type': 'Physician',
      'name': '林羿辰 醫師',
      'url': `${SITE_URL}/about/doctors`,
      'jobTitle': '院長',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '光復路一段371號B1',
        'addressLocality': '新竹市',
        'addressRegion': '東區',
        'postalCode': '300',
        'addressCountry': 'TW',
      },
      'sameAs': [
        'https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
        'https://www.pmr.org.tw/associator/associator-all.asp?w/',
        'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a='
      ],
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
  
    // 5. 地點資訊 (診所實體 - 強化在地 SEO 與 Google Maps 關聯)
    'location': {
      '@type': 'MedicalClinic',
      'name': '宸新復健科診所',
      'alternateName': 'Chenshin Rehabilitation Clinic',
      'url': SITE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/logo.webp`
      },
      'address': { 
         '@type': 'PostalAddress',
         'streetAddress': '光復路一段371號B1',
         'addressLocality': '東區',
         'addressRegion': '新竹市',
         'addressCountry': 'TW',
         'postalCode': '300'
      },
      'telephone': '+886-3-5647999',
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '24.7833314', 
        'longitude': '121.0170937'
      },
      // 服務區域：對 AI 搜尋定位您的目標客戶群非常有幫助
      'areaServed': [
        { "@type": "City", "name": "新竹市" },
        { "@type": "City", "name": "竹北市" },
        { "@type": "Place", "name": "新竹科學園區" },
        { "@type": "AdministrativeArea", "name": "新竹縣" }
      ]
    }
  };
  // 4. Schema: FAQ
  const jsonLdFAQ = program.qaList && program.qaList.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: program.qaList.map(qa => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer
      }
    }))
  } : null;

  return (
    <>
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdService} />
      {jsonLdFAQ && <JsonLd data={jsonLdFAQ} />}
      
      {/* 樣式控制：保持與治療頁面一致 */}
      <style dangerouslySetInnerHTML={{__html: `
        /* 重點文字 (strong) - 青色 */
        .article-content strong {
            color: #22d3ee !important; /* Cyan-400 */
            font-weight: 700;
        }

        /* 超連結 (a) - 桃紅色 */
        .article-content a {
            color: #ec4899 !important; /* Pink-500 */
            font-weight: 600;
            text-decoration: none;
            border-bottom: 1px dashed #ec4899;
            transition: all 0.2s ease;
        }

        .article-content a:hover {
            color: #db2777 !important; /* Pink-600 */
            border-bottom-style: solid;
        }

        /* 內容標題樣式 */
        .article-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
        }
        
        .article-content h3::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 24px;
            background-color: #06b6d4; /* Cyan-500 */
            margin-right: 12px;
            border-radius: 2px;
        }

        /* 圖片寬度限制 (針對 article-content 內的圖片) */
        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            border: 1px solid #475569;
        }

        /* 電腦版圖片寬度調整 (85% + 置中) */
        @media (min-width: 768px) {
            .article-content img {
                max-width: 85%;
            }
        }
        
        /* 列表樣式 */
        .article-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
            color: #cbd5e1;
        }
        .article-content li {
            margin-bottom: 0.5rem;
        }
        
        /* 隱藏捲軸 */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300">
        <main className="flex-grow pt-0 -mt-10 md:-mt-12 pb-12 fade-in relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* 返回按鈕 */}
            <Link href="/weight-bone" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors group">
              <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 
              返回列表
            </Link>
            
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 md:p-10">

                {/* Header: 標題與 QR Code */}
                <div className="mb-3 md:mb-6 border-l-4 border-cyan-500 pl-4 bg-gradient-to-r from-slate-900/80 to-transparent py-6 rounded-r-xl flex flex-col md:flex-row md:items-center gap-6">
                  <div className="hidden md:block bg-white p-2 rounded-lg shrink-0 group relative shadow-lg ring-2 ring-slate-700">
                    <img 
                      className="w-24 h-24 object-contain" 
                      src={qrCodeApiUrl} 
                      alt={`掃描預約 ${program.title}`} 
                    />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-600">
                      掃描帶走資訊
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold font-sans text-white mb-3 tracking-wide leading-tight">{program.title}</h1>
                    {program.subtitle && (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
    <h2 className="text-lg text-cyan-400 font-medium">
      {program.subtitle}
    </h2>
    
    <div className="text-slate-400 text-xs md:text-sm font-normal flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="flex items-center">
        撰文者：
        <Link 
          href="/about/doctors" 
          className="text-slate-300 hover:text-cyan-400 underline underline-offset-4 decoration-slate-600 transition-colors cursor-pointer"
        >
          林羿辰醫師
        </Link>
      </span>
      <span className="hidden md:inline text-slate-600">|</span>
      <span className="flex items-center">
        最後更新日期：
        {/* 修改這裡：將 data 改成 program */}
        {program.lastModified ? (
          <time dateTime={program.lastModified} itemProp="dateModified">
            {program.lastModified}
          </time>
        ) : (
          "2026-02-22"
        )}
      </span>
    </div>
  </div>
)}

                  </div>
                </div>

                {/* 小工具按鈕區 */}
                <div className="mb-4 md:mb-8">
                  {['mounjaro', 'Wegovy'].includes(slug) && (
                    <Link 
                      href="/weight-bone/BMI" 
                      className="group relative inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white font-bold shadow-lg hover:-translate-y-1 transition-all duration-300 w-full md:w-auto justify-center"
                    >
                      <FaCalculator className="text-xl md:text-2xl" />
                      <span className="text-lg md:text-xl">減重自我評估</span>
                      <i className="fa-solid fa-arrow-right text-sm ml-1 group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                  )}

                  {['bone-age'].includes(slug) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full pb-2">
                      <Link href="/about/news/child-height-growth-guide" className="group relative flex flex-row items-center justify-center gap-1.5 md:gap-3 px-2 md:px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl md:rounded-2xl text-white font-bold shadow-md hover:-translate-y-1 transition-all duration-300">
                        <FaChartLine className="text-xl md:text-2xl shrink-0" />
                        <span className="text-[15px] md:text-lg whitespace-nowrap">長高攻略</span>
                      </Link>
                      <Link href="/weight-bone/nutrition" className="group relative flex flex-row items-center justify-center gap-1.5 md:gap-3 px-2 md:px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl md:rounded-2xl text-white font-bold shadow-md hover:-translate-y-1 transition-all duration-300">
                        <FaUtensils className="text-xl md:text-2xl shrink-0" />
                        <span className="text-[15px] md:text-lg whitespace-nowrap">營養指南</span>
                      </Link>
                      <Link href="/weight-bone/child" className="group relative flex flex-row items-center justify-center gap-1.5 md:gap-3 px-2 md:px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl md:rounded-2xl text-white font-bold shadow-md hover:-translate-y-1 transition-all duration-300">
                        <FaChartLine className="text-xl md:text-2xl shrink-0" />
                        <span className="text-[15px] md:text-lg whitespace-nowrap">成長分析</span>
                      </Link>
                      <Link href="/weight-bone/calculator" className="group relative flex flex-row items-center justify-center gap-1.5 md:gap-3 px-2 md:px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl md:rounded-2xl text-white font-bold shadow-md hover:-translate-y-1 transition-all duration-300">
                        <FaBone className="text-xl md:text-2xl shrink-0" />
                        <span className="text-[15px] md:text-lg whitespace-nowrap">骨齡預測</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* 特色與優點 (Grid) */}
                {(program.whyChooseUs || program.programBenefits) && (
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
                    {program.whyChooseUs && (
                      <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/80 h-full hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300">
                        <h4 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-700 pb-2 flex items-center">
                          <i className="fa-solid fa-star mr-3"></i>
                          我們的特色
                        </h4>
                        <ul className="space-y-3 text-slate-300">
                          {program.whyChooseUs.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-cyan-500 mr-2 mt-1.5 text-xs">●</span>
                              <span dangerouslySetInnerHTML={{__html: item}} className="leading-relaxed"></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {program.programBenefits && (
                      <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/80 h-full hover:border-pink-500/30 hover:bg-slate-900/60 transition-all duration-300">
                        <h4 className="text-xl font-bold text-pink-400 mb-4 border-b border-slate-700 pb-2 flex items-center">
                          <i className={`${program.benefitsIconClass || 'fa-solid fa-thumbs-up'} mr-3`}></i>
                          {program.benefitsTitle || '療程優點'}
                        </h4>
                        <ul className="space-y-3 text-slate-300">
                          {program.programBenefits.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-pink-500 mr-2 mt-1.5 text-xs">●</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 內容說明區 (主文) */}
                <div className="article-content text-slate-300 leading-relaxed text-lg mb-10 pb-8 border-b border-slate-700/50">
                  {program.contentHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: program.contentHtml }} />
                  ) : (
                    <p>{program.description}</p>
                  )}
                </div>

                {/* 圖片展示區 */}
                {program.images && program.images.length > 0 && (
                  <div className="space-y-8 mb-14">
                    {program.images.map((img, idx) => (
                      <div key={idx} className="text-center group">
                        <div className="relative overflow-hidden rounded-xl shadow-xl inline-block w-full md:w-[85%] border border-slate-700 bg-slate-900">
                          <img src={img.src} alt={img.alt} className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700 block" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 常見問答 (Q&A) 區塊 */}
                {program.qaList && program.qaList.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <i className="fa-regular fa-circle-question text-cyan-400 mr-3"></i>
                      常見問答
                    </h3>
                    <div className="space-y-4">
                      {program.qaList.map((qa, idx) => (
                        <details key={idx} className="group bg-slate-900/30 rounded-xl border border-slate-700 overflow-hidden open:border-cyan-500/50 open:bg-slate-900/60 transition-all duration-300">
                          <summary className="flex items-start justify-between p-5 cursor-pointer list-none hover:bg-slate-800/50 transition-colors">
                            <h4 className="font-bold text-lg text-slate-200 flex items-start group-hover:text-cyan-300 transition-colors">
                              <span className="text-cyan-500 mr-3 font-black mt-0.5">Q{idx + 1}.</span>
                              <span className="leading-relaxed">{qa.question}</span>
                            </h4>
                            <span className="text-slate-500 group-hover:text-cyan-400 group-open:rotate-180 group-open:text-cyan-500 transition-all duration-300 ml-4 mt-1 shrink-0">
                              <i className="fa-solid fa-chevron-down"></i>
                            </span>
                          </summary>
                          <div className="px-6 pb-6 pt-0 text-slate-300 leading-relaxed ml-0 md:ml-10">
                            <div className="border-l-2 border-slate-600 pl-4 py-1 text-base md:text-lg animate-in fade-in slide-in-from-top-2">
                              {qa.answer}
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 相關案例區塊 */}
              {matchedCases.length > 0 && (
                  <section className="pt-4 pb-4 border-t border-slate-800 bg-slate-900/50 overflow-hidden px-4 md:px-10">
                    <div className="flex items-center mb-5 mt-6">
                      <i className="fa-solid fa-file-medical text-cyan-400 text-xl mr-3"></i>
                      <h3 className="text-2xl font-bold text-white m-0">相關治療案例</h3>
                    </div>
                    
                    <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                      {matchedCases.map((item) => (
                        <Link 
                          key={item.id} 
                          href={`/about/cases/${item.id}`} 
                          className="group block flex-shrink-0 w-[75vw] sm:w-64 md:w-auto snap-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all duration-300"
                        >
                          <div className="aspect-video overflow-hidden relative">
                             <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                             <h4 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                             <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{item.summary}</p>
                             <div className="text-cyan-500 text-sm font-bold flex items-center">
                               閱讀案例詳情 <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                             </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* 修正 4：醫師資歷方塊 (將 animate-on-scroll 移除或改為即時顯示確保穩定性) */}
                
                  <div className="mt-8 mb-10">
                    <div className="bg-slate-800/40 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                      
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                        <div className="flex-grow text-center md:text-left">
                          <div className="mb-2">
                          <h3 className="text-xl font-bold text-white flex flex-col md:flex-row items-center gap-2">
  本文由 
  <Link 
    href="/about/doctors"
    className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer underline underline-offset-4 decoration-cyan-900/50 hover:decoration-cyan-400"
  >
    林羿辰醫師
  </Link> 
  撰寫與醫學審閱
  <span className="hidden md:inline-block text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 font-normal uppercase tracking-wider">
    Verified Expert
  </span>
</h3>
                            <p className="text-sm text-slate-400 mt-1 font-medium">宸新復健科診所院長 / 復健科專科醫師</p>
                          </div>
                          
                          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                            現任宸新復健科診所院長。畢業於國立台灣大學醫學系，擁有復健科、骨質疏鬆雙專科醫師資歷，專精於精準超音波導引注射治療、增生療法與各類運動傷害。林醫師具備豐富臨床經驗，致力於將醫學實證應用於病患康復。
                          </p>

                          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-700/50">
                            <Link 
                              href="/about/doctors" 
                              className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center group transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-id-card-clip mr-2 text-lg"></i>
                              <span className="border-b border-cyan-500/30 group-hover:border-cyan-300">👉 查看更多醫師資歷、證照認證與學術論文</span>
                              <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </Link>
                            
                            <div className="flex flex-col items-end gap-1 text-[10px] md:text-xs text-slate-500">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center"><i className="fa-solid fa-check-double mr-1 text-cyan-500/70"></i> 專家審閱完成</span>
                                <span className="flex items-center"><i className="fa-solid fa-database mr-1 text-cyan-500/70"></i> 來源：醫學實證與專科臨床</span>
                              </div>
                              <div className="text-gray-500">
                                最後更新日期：
                                {program.lastModified ? (
                                  <time dateTime={program.lastModified} itemProp="dateModified">
                                    {program.lastModified}
                                  </time>
                                ) : (
                                  "2026-02-22"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                

              {/* 底部分享區塊 */}
              <div className="bg-slate-900/80 p-8 md:p-12 border-t border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"></div>
                
                <h3 className="text-white font-bold text-2xl mb-3 relative z-10">覺得這篇文章有幫助嗎？</h3>
                <p className="text-slate-400 mb-8 text-lg relative z-10">歡迎分享給親朋好友，讓更多人獲得正確的復健知識。</p>

                <div className="relative z-10">
                    <ShareButtons url={currentPageUrl} title={program.title} />
                </div>

                <div className="mt-12 pt-8 border-t border-slate-700/50 relative z-10">
                  <Link
                    href="/weight-bone"
                    className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-bold text-cyan-400 border border-cyan-500/30 rounded-full hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 group"
                  >
                    看更多相關資訊
                    <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  )
}