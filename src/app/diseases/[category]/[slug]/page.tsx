// src/app/diseases/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { getDiseaseBySlug, generateAllDiseaseParams } from '@/data/diseases'
import ShareButtons from '@/components/ShareButtons'
// ✨ 新增：匯入案例資料
import { casesData } from '@/data/cases'

// 定義常數，方便未來修改
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dryichen.com.tw'

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

// 1. 產生靜態路徑
export async function generateStaticParams() {
  return generateAllDiseaseParams()
}

// 2. SEO Metadata (修正重點：移除重複診所名稱)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const disease = getDiseaseBySlug(params.category, params.slug)
  if (!disease) return { title: '疾病介紹不存在' }

  // ★★★ 定義標準網址 (Canonical URL) ★★★
  const canonicalUrl = `${SITE_URL}/diseases/${params.category}/${params.slug}`

  return {
    // 修正：這裡移除手寫的「| 新竹宸新復健科」，讓 layout 的 template 自動組合，避免重複
    title: `${disease.title} - 疾病衛教 | 新竹宸新復健科`, 
    description: disease.seoDescription || disease.description,
    keywords: disease.seoKeywords,
    
    // ★★★ 加入 Canonical Tag ★★★
    alternates: {
        canonical: canonicalUrl,
    },

    openGraph: {
      title: disease.title,
      description: disease.seoDescription || disease.description,
      url: canonicalUrl, 
      type: 'article',
    }
  }
}

export default function DiseaseDetailPage({ params }: PageProps) {
  const disease = getDiseaseBySlug(params.category, params.slug)
  if (!disease) notFound()

  // 方案一：從元件層級修正標籤結構 (H3->H2, H4->H3)
  // 這樣全站 50 篇疾病衛教的內容大綱會立刻變得符合 SEO 邏輯
  const optimizedContent = disease.contentHtml
    ? disease.contentHtml
        .replace(/<h3/g, '<h2')     // 把所有內容中的 H3 提升為 H2 (主要章節)
        .replace(/<\/h3>/g, '</h2>')
        .replace(/<h4/g, '<h3')     // 把所有內容中的 H4 提升為 H3 (子項目)
        .replace(/<\/h4>/g, '</h3>')
    : null;

  // 頁面內部使用的網址，確保與 Canonical 一致
  const currentPageUrl = `${SITE_URL}/diseases/${params.category}/${params.slug}`
  
  // QR Code API
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=ffffff&data=${encodeURIComponent(currentPageUrl)}`

  // ✨ 強化篩選邏輯
  const matchedCases = casesData.filter(c => {
    const hasMatchingTag = disease.tags && c.tags?.some(tag => disease.tags?.includes(tag));
    const hasMatchingTitle = c.title.includes(disease.title);
    const hasTagIncludesTitle = c.tags?.some(tag => disease.title.includes(tag) || tag.includes(disease.title));
    return hasMatchingTag || hasMatchingTitle || hasTagIncludesTitle;
  }).slice(0, 6);

  // ==========================================
  // SEO Schema 1: 麵包屑
  // ==========================================
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '疾病衛教', item: `${SITE_URL}/diseases` },
      { '@type': 'ListItem', position: 3, name: disease.title, item: currentPageUrl },
    ],
  }

  // ==========================================
  // SEO Schema 2: 醫療網頁 (E-E-A-T 增強版)
  // ==========================================
  const jsonLdMedicalWebPage = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${currentPageUrl}#webpage`,
    url: currentPageUrl,
    // 強化標題，結合專業品牌詞
    name: `${disease.title} - 專業疾病衛教與復健治療 | 宸新復健科診所`,
    description: disease.seoDescription || disease.description,
    
    // 時效性控制：GEO 引擎判斷內容新鮮度的核心
    datePublished: '2026-01-25',
    dateModified: disease.lastModified || '2026-02-25',
    
    // 1. 作者 (Author)：強調醫師個人的權威背景
    author: {
      '@type': 'Physician',
      name: '林羿辰 醫師',
      url: `${SITE_URL}/about/doctors`,
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
      // 機構隸屬關係
      affiliation: {
          '@type': 'MedicalClinic',
          name: '宸新復健科診所',
          url: SITE_URL,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '光復路一段371號B1',
            addressLocality: '新竹市',
            addressRegion: '東區',
            postalCode: '300',
            addressCountry: 'TW',
          }
      },
      // 學歷背景
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: '國立台灣大學醫學系'
      },
      // 醫學專長
      medicalSpecialty: [
        { '@type': 'MedicalSpecialty', 'name': 'Physical Medicine and Rehabilitation' },
        { '@type': 'MedicalSpecialty', 'name': 'Sports Medicine' }
      ],
      // 醫師實體唯一性識別連結 (SameAs)
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
  
    // 2. 審閱者 (ReviewedBy)：醫療 YMYL 內容加分項
    reviewedBy: {
      '@type': 'Physician',
      name: '林羿辰 醫師',
      url: `${SITE_URL}/about/doctors`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '光復路一段371號B1',
        addressLocality: '新竹市',
        addressRegion: '東區',
        postalCode: '300',
        addressCountry: 'TW',
      },
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
  
    // 3. 發佈者 (Publisher)：標註為正式醫療診所
    publisher: {
        '@type': 'MedicalClinic',
        name: '宸新復健科診所',
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.webp`
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '光復路一段371號B1',
          addressLocality: '新竹市',
          addressRegion: '東區',
          postalCode: '300',
          addressCountry: 'TW',
        },
        'telephone': '+886-3-5647999',
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '24.7833314', 
          'longitude': '121.0170937'
        }
    },
  
    // 4. 疾病主體 (MainEntity)：將網頁內容轉化為結構化醫學實體
    mainEntity: {
      '@type': 'MedicalCondition',
      name: disease.title,
      description: disease.seoDescription || disease.description,
      // 症狀 (自動從資料庫映射)
      signOrSymptom: disease.symptoms.map(s => ({
        '@type': 'MedicalSymptom',
        name: s
      })),
      // 建議療程 (自動從資料庫映射，並過濾 HTML 標籤)
      possibleTreatment: disease.treatments.map(t => ({
        '@type': 'MedicalTherapy',
        name: t.replace(/<[^>]*>?/gm, '') 
      })),
      // 指導醫學分類
      associatedAnatomy: {
        '@type': 'AnatomicalStructure',
        'name': 'Musculoskeletal System (肌肉骨骼系統)'
      }
    }
  };
  
  return (
    <>
      <JsonLd data={jsonLdBreadcrumb} />
      <JsonLd data={jsonLdMedicalWebPage} />

      <style dangerouslySetInnerHTML={{__html: `
        .article-content strong {
            color: #22d3ee !important;
            font-weight: 700;
        }

        .article-content a {
            color: #ec4899 !important;
            font-weight: 600;
            text-decoration: none;
            border-bottom: 1px dashed #ec4899;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 2px;
        }

        .article-content a:hover {
            color: #db2777 !important;
            border-bottom-style: solid;
            background-color: rgba(236, 72, 153, 0.15);
            padding: 0 4px;
            margin: 0 -4px;
            border-radius: 4px;
        }

        .article-content a::after {
            content: "↗";
            font-size: 0.85em;
            font-weight: bold;
            margin-bottom: 2px;
        }

        .article-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
            border: 1px solid #475569;
        }

        @media (min-width: 768px) {
            .article-content img {
                max-width: 85%;
            }
        }

        .article-content h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
            border-left: 4px solid #06b6d4;
            padding-left: 1rem;
        }

        .article-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #67e8f9;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }

        .article-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .article-content li {
            margin-bottom: 0.5rem;
        }
      `}} />

      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300">
       <main className="flex-grow pt-0 -mt-10 md:-mt-12 pb-12 fade-in relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            <Link href={`/diseases/${params.category}`} className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors group">
              <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
              返回分類列表
            </Link>

            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">

              <div className="p-4 md:p-10">

                <div className="mb-10 border-l-4 border-cyan-500 pl-4 bg-gradient-to-r from-slate-900/80 to-transparent py-6 rounded-r-xl flex flex-col md:flex-row md:items-center gap-6">
                  <div className="hidden md:block bg-white p-2 rounded-lg shrink-0 group relative shadow-lg ring-2 ring-slate-700">
                    <img className="w-24 h-24 object-contain" src={qrCodeApiUrl} alt={`掃描閱讀 ${disease.title}`} />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-600">
                      掃描帶走文章
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold font-sans text-white mb-3 tracking-wide leading-tight">{disease.title}</h1>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">

    
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
        {disease.lastModified ? (
          <time dateTime={disease.lastModified} itemProp="dateModified">
            {disease.lastModified}
          </time>
        ) : (
          "2026-02-22"
        )}
      </span>
    </div>
  </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
                  {/* 症狀：修正為 div 標籤以優化 SEO 結構 */}
                  <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/80 h-full hover:border-pink-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <div className="text-xl font-bold text-pink-400 mb-4 border-b border-slate-700 pb-2 flex items-center">
                      <i className="fa-solid fa-triangle-exclamation mr-3"></i>
                      常見症狀
                    </div>
                    <ul className="space-y-3 text-slate-300">
                      {disease.symptoms.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                           <span className="text-pink-500 mr-2 mt-1.5 text-xs">●</span>
                           <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 治療建議：修正為 div 標籤以優化 SEO 結構 */}
                  <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700/80 h-full hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300">
                    <div className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-700 pb-2 flex items-center">
                      <i className="fa-solid fa-user-doctor mr-3"></i>
                      治療建議
                    </div>
                    <ul className="space-y-3 text-slate-300">
                      {disease.treatments.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-cyan-500 mr-2 mt-1.5 text-xs">●</span>
                          <span 
                            className="leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 文章內容：使用自動優化後的 optimizedContent */}
                <div className="article-content text-slate-300 leading-relaxed text-lg pb-6">
                  {optimizedContent ? (
                    <div dangerouslySetInnerHTML={{ __html: optimizedContent }} />
                  ) : (
                    <p>{disease.content || disease.description}</p>
                  )}
                </div>

              </div>

              {matchedCases.length > 0 && (
                <section className="pt-4 pb-4 border border-slate-800 bg-slate-900/50 rounded-3xl overflow-hidden mx-2 md:mx-4 mb-8">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex items-center mb-5">
                      <i className="fa-solid fa-file-medical text-cyan-400 text-xl mr-3"></i>
                      <h2 className="text-2xl font-bold text-white">
                        {disease.title} 治療成功案例
                      </h2>
                    </div>

                    <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                      {matchedCases.map((item) => (
                        <Link 
                          key={item.id} 
                          href={`/about/cases/${item.id}`} 
                          className="group block flex-shrink-0 w-[66vw] sm:w-64 md:w-auto md:flex-shrink-1 min-w-0 snap-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300"
                        >
                          <div className="h-32 md:h-40 overflow-hidden relative">
                            <img 
                              src={item.coverImage} 
                              alt={item.title} 
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          <div className="p-3">
                            <h3 className="text-base font-bold text-slate-100 mb-1 line-clamp-2 leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-slate-400 text-xs line-clamp-2 mb-2">
                              {item.summary}
                            </p>
                            <div className="text-cyan-500 text-xs font-bold">
                              閱讀案例 <i className="fa-solid fa-arrow-right ml-1"></i>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

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
                                {disease.lastModified ? (
                                  <time dateTime={disease.lastModified} itemProp="dateModified">
                                    {disease.lastModified}
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
                

              <div className="bg-slate-900/80 p-8 md:p-12 border-t border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"></div>
                
                <h3 className="text-white font-bold text-2xl mb-3 relative z-10">覺得這篇文章有幫助嗎？</h3>
                <p className="text-slate-400 mb-8 text-lg relative z-10">歡迎分享給親朋好友，讓更多人獲得正確的復健知識。</p>

                <div className="relative z-10">
                    <ShareButtons url={currentPageUrl} title={disease.title} />
                </div>

                <div className="mt-12 pt-8 border-t border-slate-700/50 relative z-10">
                  <Link
                    href="/diseases"
                    className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-bold text-cyan-400 border border-cyan-500/30 rounded-full hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 group"
                  >
                    看更多疾病衛教
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