// src/app/treatments/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { getTreatmentBySlug, getAllTreatmentSlugs } from '@/data/treatments'
import ArticleDetail, { ArticleData } from '@/components/ArticleDetail'

// 1. 匯入資料抓取功能
import { getRelatedCases } from '@/data/cases'         // 抓取案例資料

// 定義常數
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dryichen.com.tw').trim()

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return getAllTreatmentSlugs()
}

// 動態 Meta 設定 (SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const treatment = getTreatmentBySlug(params.slug)
  if (!treatment) return { title: '項目不存在' }

  const canonicalUrl = `${SITE_URL}/treatments/${params.slug}`

  return {
    // 修正：移除後綴診所名，避免與 layout.tsx 模板疊加
    title: treatment.seoTitle || `${treatment.title}  `, 
    description: treatment.seoDescription || treatment.description,
    keywords: treatment.keywords || ['新竹復健', '骨科', treatment.title, '宸新復健科'],
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
      title: treatment.title ,
      description: treatment.seoDescription || treatment.description,
      url: canonicalUrl,
      type: 'article',
      siteName: '新竹宸新復健科診所',
      images: treatment.images && treatment.images.length > 0 ? [treatment.images[0].src] : [],
    },
    // 加入在地化 Geo 標記
    other: {
      'geo.region': 'TW-HCH',
      'geo.placename': '新竹市',
    }
  }
}

export default function TreatmentDetailPage({ params }: PageProps) {
  const treatment = getTreatmentBySlug(params.slug)
  if (!treatment) notFound()

  // 網址設定
  const currentPageUrl = `${SITE_URL}/treatments/${params.slug}`

  // --- 資料獲取區 ---

  // A. 抓取「成功案例」 (根據 Tags)
  const matchedCases = getRelatedCases(treatment.tags);

  // ------------------

  // 轉換資料格式給 ArticleDetail
  const articleData: ArticleData = {
    title: treatment.title,
    subtitle: treatment.subtitle,
    description: treatment.description,
    contentHtml: treatment.contentHtml,
    images: treatment.images,
    youtubeVideoId: treatment.youtubeVideoId,
    whyChooseUs: treatment.whyChooseUs,
    treatmentFocus: treatment.treatmentFocus,
    qaList: treatment.qaList,
    keywords: treatment.keywords, 
  }

  // Schema (JSON-LD)
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '治療方式', item: `${SITE_URL}/treatments` },
      { '@type': 'ListItem', position: 3, name: treatment.title, item: currentPageUrl },
    ],
  }

  const jsonLdProcedure = {
    '@context': 'https://schema.org',
    // 為了讓 Google 更好理解這不僅是醫療程序，也是一篇衛教文章，保留原有的 '@type'
    '@type': 'TherapeuticProcedure',
    name: treatment.title,
    headline: treatment.seoTitle,
    
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
    medicalSpecialty: [
      'Physical Medicine and Rehabilitation',
      'SportsMedicine'
    ],
    // 讓 AI 引擎確認醫師身份的外部權威連結
    'sameAs': [
      'https://ma.mohw.gov.tw/Accessibility/DOCSearch/DOCBasicData?DOC_SEQ=2bJQOvvE5EX3U6eK7eSvhw%253D%253D',
      'https://www.pmr.org.tw/associator/associator-all.asp?w/',
      'https://www.toa1997.org.tw/orthopedist/?n=%E6%9E%97%E7%BE%BF%E8%BE%B0&h=&c=&a='
    ],
    // 證照資訊：GEO (AI 搜尋) 判斷可信度的關鍵
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

  'description': treatment.seoDescription || treatment.description,
  'procedureType': 'Non-surgical',
  'url': currentPageUrl,
  
  // 2. 時效性 (GEO 關鍵點)

    datePublished: '2026-01-25',
    dateModified: treatment.lastModified || '2026-02-22',


  'image': treatment.images && treatment.images.length > 0 
    ? treatment.images.map(img => img.src.startsWith('http') ? img.src : `${SITE_URL}${img.src}`) 
    : [`${SITE_URL}/images/main/a.webp`],

  // 3. 醫學專科與解剖結構
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

  // 4. 提供者區塊 (強化執行者的專業背景)
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

  // 5. 地點資訊 (強化 Local SEO / Google Maps)
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
    'areaServed': [
      { "@type": "City", "name": "新竹市" },
      { "@type": "City", "name": "竹北市" },
      { "@type": "Place", "name": "新竹科學園區" },
      { "@type": "AdministrativeArea", "name": "新竹縣" }
    ]
  }

  }

  const jsonLdFAQ = treatment.qaList && treatment.qaList.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: treatment.qaList.map(qa => ({
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
      <JsonLd data={jsonLdProcedure} />
      {jsonLdFAQ && <JsonLd data={jsonLdFAQ} />}

      <ArticleDetail 
        data={articleData} 
        backLink={{ href: '/treatments', label: '返回治療列表' }}
        currentUrl={currentPageUrl}
        layoutStyle="standard" 
        relatedCases={matchedCases}
      />
    </>
  )
}