// src/app/about/cases/[id]/page.tsx

import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ShareButtons from '@/components/ShareButtons'
// 匯入案例資料與組件
import { casesData, getCaseById } from '@/data/cases'
import RelatedCases from '@/components/RelatedCases' 

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dryichen.com.tw').trim()

interface PageProps { params: { id: string } }

// 產生靜態路徑 (確保這步沒錯，Next.js 才知道有哪些頁面)
export async function generateStaticParams() {
  return casesData.map((post) => ({ id: post.id }))
}

// 1. Meta 設定 (優化：解決 Title 重複、加入 Geo 標籤)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getCaseById(params.id)
  if (!post) return { title: '案例不存在' }
  
  // 修正：不在此處加診所名後綴，交給 layout.tsx 的 title.template 處理
  const pageTitle = post.seoTitle ? post.seoTitle : post.title
  const canonicalUrl = `${SITE_URL}/about/cases/${params.id}`
   
  return {
    title: `${post.title} | 新竹宸新復健科`,
    description: post.seoDescription || post.summary,
    keywords: post.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      url: canonicalUrl,
      type: 'article',
      siteName: '新竹宸新復健科診所',
      images: [
        {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
        }
      ]
    },
    // 加入在地化 Geo 標記
    other: {
      'geo.region': 'TW-HCH',
      'geo.placename': '新竹市',
    }
  }
}

export default function CaseDetailPage({ params }: PageProps) {
  const post = getCaseById(params.id)
  
  // 如果 ID 對不上，回傳 404
  if (!post) notFound()

  const currentUrl = `${SITE_URL}/about/cases/${params.id}`

  // 篩選出「其他相關案例」 (排除當前這一篇)
  const otherCases = casesData.filter(c => c.id !== post.id).slice(0, 3);

  // 2. Schema (優化：使用完整 Logo 網址)
  const jsonLdData = {
    '@context': 'https://schema.org',
    // 使用 MedicalScholarlyArticle 非常正確，這能告訴 Google 這是具備學術價值的臨床案例
    '@type': 'MedicalScholarlyArticle',
    'genre': 'Case Report',
    '@id': `${currentUrl}#case-study`,
    'url': currentUrl,
    'headline': post.title,
    'image': [post.coverImage || `${SITE_URL}/images/main/a.webp`],
    'description': post.summary,
    
    // 時效性優化：AI 搜尋非常看重內容更新日期
    'datePublished': '2026-01-25',
    'dateModified':  post.date || '2026-02-25',
  
    // 1. 作者強化 (EEAT 核心)：將 Person 提升為 Physician 並加入證照與外部連結
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
        { '@type': 'MedicalSpecialty', 'name': 'Physical Medicine and Rehabilitation' },
        { '@type': 'MedicalSpecialty', 'name': 'Sports Medicine' }
      ],
      // 建立實體關聯，讓 Google 確認醫師的真實權威性
      'sameAs': [
        'hhttps://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
        'https://www.pmr.org.tw/associator/associator-all.asp?w/',
        'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a='
      ],
      // 醫師證照：GEO 判定「醫療事實」的重要依據
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
  
    // 2. 發佈者 (Publisher)：強化診所在地的權威與聯絡資訊
    'publisher': { 
      '@type': 'MedicalClinic', // 比 MedicalOrganization 更精確
      'name': '宸新復健科診所',
      'alternateName': 'Chenshin Rehabilitation Clinic',
      'telephone': '+886-3-564-7999',
      'priceRange': '$$', 
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
        'addressCountry': 'TW',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '24.7833314', 
        'longitude': '121.0170937'
      },
      // 地區權重：幫助新竹、竹北、竹科的病患搜尋到此案例
      'areaServed': [
        { "@type": "City", "name": "新竹市" },
        { "@type": "City", "name": "竹北市" },
        { "@type": "Place", "name": "新竹科學園區" },
        { "@type": "AdministrativeArea", "name": "新竹縣" }
      ],
      sameAs: [
        'https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
        'https://www.pmr.org.tw/associator/associator-all.asp?w/',
        'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a='
      ],
      // 專業證照 (Credentials)
      hasCredential: [
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
  
    // 3. 案例主題強化 (About)：連結具體的疾病與治療方式
    'about': [
      {
        '@type': 'MedicalCondition',
        name: post.tags && post.tags.length > 0 ? post.tags[0] : '慢性疼痛'
      },
      {
        '@type': 'MedicalTherapy',
        'name': '增生療法 (Prolotherapy) / 超音波導引注射'
      }
    ],
  
    // 4. 關鍵屬性：標註這是針對人類的醫學研究
    'audience': {
      '@type': 'MedicalAudience',
      'audienceType': 'Patients',
      'geographicArea': { '@type': 'City', 'name': '新竹' }
    }
  }

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '治療案例', item: `${SITE_URL}/about/news` },
      { '@type': 'ListItem', position: 3, name: post.title, item: currentUrl },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLd data={jsonLdBreadcrumb} />

      <style dangerouslySetInnerHTML={{__html: `
        .article-content strong { color: #22d3ee !important; font-weight: 700; }
        .article-content a { color: #ec4899 !important; font-weight: 600; text-decoration: none; border-bottom: 1px dashed #ec4899; transition: all 0.2s ease; }
        .article-content a:hover { background-color: rgba(236, 72, 153, 0.15); border-bottom-style: solid; }
        .article-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem auto; display: block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); border: 1px solid #334155; }
        @media (min-width: 768px) { .article-content img { max-width: 85%; } }
        .article-content h2 { font-size: 1.5rem; font-weight: 700; color: white; margin: 2rem 0 1rem; padding-left: 1rem; border-left: 4px solid #06b6d4; }
        .article-content h3 { font-size: 1.25rem; font-weight: 600; color: #67e8f9; margin: 1.5rem 0 0.75rem; }
        .article-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #cbd5e1; }
        .article-content li { margin-bottom: 0.4rem; }
        .article-content p { margin-bottom: 1rem; }
      `}} />

      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300">
        <main className="flex-grow pt-0 -mt-10 md:-mt-12 pb-12 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
            <nav className="mb-4 pt-4 flex items-center justify-between">
                <Link href="/about/news" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group text-sm font-medium">
                    <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 
                    返回所有案例
                </Link>
            </nav>

            <article className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              
              {/* 內容 Padding */}
              <div className="p-5 md:p-12 pb-2">
                  
                  {/* Header */}
                  <header className="mb-8 border-b border-slate-700/50 pb-6">
                      <div className="flex-grow">



                          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-sans text-white mb-4 lg:mb-6 leading-tight lg:leading-snug">
                              {post.title}
                          </h1>

                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 w-full">
  {/* 左側：分類標籤與撰文者 */}
  <div className="flex items-center gap-3">
    <span className="px-3 py-1 rounded-full text-sm font-bold border tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
      {post.category}
    </span>
    
    <span className="text-slate-400 text-sm flex items-center">
      撰文者：
      <Link 
        href="/about/doctors" 
        className="text-slate-300 hover:text-cyan-400 underline underline-offset-4 decoration-slate-600 transition-colors"
      >
        林羿辰醫師
      </Link>
    </span>
  </div>

  {/* 右側：最後更新日期 */}
  <span className="text-slate-300 text-sm flex items-center bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
    <i className="fa-regular fa-calendar mr-2"></i>
    最後更新日期：{post.date}
  </span>
</div>
                          <div className="bg-slate-900/50 rounded-xl p-4 md:p-4 border-l-4 border-cyan-500">
                              <div className="flex items-start gap-3">
                                <i className="fa-solid fa-user-doctor text-cyan-500 mt-1"></i>
                                <p className="text-lg text-slate-300 italic m-0">
                                  {post.summary}
                                </p>
                              </div>
                          </div>
                      </div>
                  </header>

                  {/* 內容區 */}
                  <div className="article-content text-slate-300 leading-relaxed text-lg mb-6">
                      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                  </div>
                  
                  {/* 醫療免責聲明 */}
                  <div className="mb-4 bg-slate-900/40 border border-slate-700 rounded-lg p-4 text-sm text-slate-500">
                      <div className="flex items-start gap-3">
                        <i className="fa-solid fa-circle-exclamation text-slate-400 mt-0.5"></i>
                        <p className="m-0 text-left">
                            <strong>醫療免責聲明：</strong> 本網站所分享之案例僅作為衛教知識分享，每位患者的身體狀況、病症嚴重程度與復原能力皆不同，實際治療成效因人而異。
                        </p>
                      </div>
                  </div>

                  {/* 相關案例 */}
                  {otherCases.length > 0 && (
                     <div className="mb-0 pt-0">
                        <RelatedCases cases={otherCases} />
                     </div>
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
                                {post.date ? (
                                  <time dateTime={post.date} itemProp="dateModified">
                                    {post.date}
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

              </div>

              {/* ✨ 底部分享區塊 (優化：H2 層級應用) */}
              <footer className="bg-slate-900/80 p-8 md:p-12 border-t border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"></div>
                 
                <h2 className="text-white font-bold text-2xl mb-3 relative z-10">覺得這篇文章有幫助嗎？</h2>
                <p className="text-slate-400 mb-8 text-lg relative z-10">歡迎分享給親朋好友，讓更多人獲得正確的復健知識。</p>
                 
                <div className="relative z-10">
                    <ShareButtons url={currentUrl} title={post.title} />
                </div>
              </footer>

            </article>

            {/* 查看更多連結 */}
            <div className="mt-8 text-center">
                <Link href="/about/news" className="text-slate-500 hover:text-cyan-400 text-sm font-medium transition-colors">
                    查看更多項目 <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
            </div>

          </div>
       </main>
      </div>
    </>
  )
}