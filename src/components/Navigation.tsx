'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image' 
import { usePathname } from 'next/navigation'

// ✨ 精準引入 FA6 與 Si 圖示
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaCalendarCheck, 
  FaHouse,      
  FaChevronDown, 
  FaCaretRight 
} from "react-icons/fa6";
import { SiThreads } from "react-icons/si";

type SubItem = {
  name: string;
  path: string;
}

type NavItem = {
  name: string;
  path: string;
  subItems?: SubItem[];
}

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  const navItems: NavItem[] = [
    { 
        name: '關於服務', 
        path: '/about',
        subItems: [
            { name: '服務理念', path: '/about/concept' },
            { name: '嚴選車隊介紹', path: '/about/fleet' },
            { name: '旅客評價分享', path: '/about/reviews' },
        ]
    },
    { 
        name: '我們的特色', 
        path: '/whychooseus',
    },
    { 
        name: '熱門路線', 
        path: '/europe', 
        subItems: [
            { name: '義大利深度旅遊', path: '/europe/italy' },
            { name: '瑞士優美絕境', path: '/europe/switzerland' },
            { name: '德法經典之旅', path: '/europe/franceGermany' },
            { name: '中歐奧捷匈巡禮', path: '/europe/centraleurope' }
        ]
    },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency", 
    "name": "Elegant Europe 優雅歐洲包車",
    "image": "https://yourdomain.com/hero-image.jpg",
    "url": "https://yourdomain.com",
    "telephone": "+886-975-665-786",
    "priceRange": "TWD",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TW",
      "addressRegion": "Taiwan"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.0330",
      "longitude": "121.5654"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "歐洲包車旅遊服務清單",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "法國包車客製化旅遊",
            "description": "專業華語司導，深度遊覽巴黎、南法普羅旺斯。"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "瑞士少女峰包車服務",
            "description": "專車接送往返蘇黎世、格林德瓦，享受無憂旅程。"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "義大利深度包車旅行",
            "description": "羅馬、佛羅倫斯、威尼斯私人司導服務。"
          }
        }
      ]
    },
    "sameAs": ["https://line.me/R/ti/p/@261RYSIY"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "jimmyforjob2@gmail.com",
      "availableLanguage": ["Chinese", "English"]
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCF9]/80 backdrop-blur-lg border-b border-[#EFECE6] transition-all duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* --- Logo 與頂部區塊 --- */}
        <div className="flex items-center justify-center md:justify-between py-4 md:py-5 border-b border-[#F2EFE9]">
          
          <Link href="/" className="flex items-center gap-3 md:gap-4 group md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
              <div className="relative w-14 h-14 md:w-20 md:h-20 overflow-hidden rounded-full border-[3px] border-white shadow-sm bg-white transition-transform group-hover:scale-105 shrink-0">
                  <Image 
                    src="/images/logo.webp" 
                    alt="歐洲包車旅遊 Logo" 
                    fill 
                    sizes="(max-width: 768px) 56px, 80px"
                    className="object-cover"
                  />
              </div>
              <div className="text-left flex flex-col justify-center">
                <div className="text-lg md:text-2xl font-serif italic text-slate-800 tracking-tight leading-tight">
                  歐洲漫行-旅遊規劃師
                </div>
                <p className="text-[10px] md:text-[13px] text-slate-600 tracking-[0.1em] md:tracking-[0.3em] uppercase mt-1 md:mt-2 font-bold font-serif italic whitespace-nowrap">
                  義大利 奧捷匈 瑞士 德法 西葡
                </p>
              </div>
          </Link>

          {/* 右側社群按鈕 */}
          <div className="hidden md:flex items-center gap-3 ml-auto z-20">
              <Link href="/" className="w-10 h-10 rounded-full bg-white text-[#8E9AAF] flex items-center justify-center hover:bg-slate-50 transition-colors border border-[#EFECE6] shadow-sm">
                <FaHouse size={18} />
              </Link>
              <a href="https://www.facebook.com/profile.php?id=61579679421074" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-[#1877F2] flex items-center justify-center hover:bg-blue-50 transition-colors border border-[#EFECE6] shadow-sm">
                <FaFacebookF size={16} />
              </a>
              <a href="https://www.instagram.com/wanderthrougheurope/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-[#E4405F] flex items-center justify-center hover:bg-pink-50 transition-colors border border-[#EFECE6] shadow-sm">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.threads.com/@wanderthrougheurope" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-slate-100 transition-colors border border-[#EFECE6] shadow-sm">
                <SiThreads size={18} />
              </a>
          </div>
        </div>

        {/* --- 導覽選單 --- */}
        <nav className="py-2 md:py-3 relative">
            <ul className="flex justify-between md:justify-center items-center gap-1 md:gap-3">
              {navItems.map((item) => (
                <li key={item.path} className="relative group flex-1 md:flex-none">
                    <Link 
                      href={item.path} 
                      className={`
                        flex items-center justify-center px-1 md:px-5 py-2 text-[13.5px] md:text-[15px] rounded-full transition-all whitespace-nowrap tracking-tighter md:tracking-wide
                        ${isActive(item.path) 
                          ? 'text-slate-800 font-bold bg-[#F2EFE9]' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-[#F2EFE9]/50'}
                      `}
                    >
                      {item.name}
                      {item.subItems && <FaChevronDown size={8} className="hidden md:block ml-1 opacity-30 group-hover:rotate-180 transition-transform duration-500" />}
                    </Link>

                    {item.subItems && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-white border border-[#EFECE6] rounded-[1.5rem] shadow-xl shadow-slate-200/30 overflow-hidden z-[60] opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible transition-all duration-300 transform md:group-hover:translate-y-0 translate-y-2">
                        <div className="py-2">
                            {item.subItems.map((sub) => (
                                <Link 
                                    key={sub.path} href={sub.path}
                                    className="block px-6 py-3 text-[13px] text-slate-500 hover:bg-[#FDFBF7] hover:text-slate-900 transition-colors"
                                >
                                    <FaCaretRight size={10} className="inline-block mr-2 text-[#C4A484] opacity-50" />
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                      </div>
                    )}
                </li>
              ))}
              
              <li className="flex-1 md:flex-none">
                <Link 
                  href="/booking" 
                  className="flex items-center justify-center py-2 px-1 md:px-7 bg-[#7A9EAF] text-white rounded-full text-[13px] md:text-xs font-bold tracking-tighter md:tracking-[0.15em] hover:bg-[#8E9AAF] transition-all shadow-md shadow-blue-100/50 uppercase whitespace-nowrap"
                >
                  立即諮詢
                </Link>
              </li>
            </ul>
        </nav>
      </div>
    </header>
  )
}