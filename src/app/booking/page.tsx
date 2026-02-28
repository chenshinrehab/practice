'use client'

import React from 'react'
import Image from 'next/image';
// ✅ 具名引入：只抓取需要的圖示，大幅減少打包體積
import { 
  FaBookOpen, 
  FaLine, 
  FaUserPlus, 
  FaEnvelope, 
  FaCircleCheck, 
  FaSquareParking 
} from "react-icons/fa6"; 

export default function BookingPage() {
  // 您的聯絡信箱
  const contactEmail = "jimmyforjob2@gmail.com"; 

  // 🟢 進階 SEO：旅遊機構 (TravelAgency) 結構化資料
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency", 
    "name": "Elegant Europe 優雅歐洲包車",
    "image": "https://yourdomain.com/hero-image.jpg", 
    "url": "https://yourdomain.com", 
    "telephone": "+886-975-665-786",
    "priceRange": "TWD",
    "areaServed": [
      { "@type": "Country", "name": "France" },
      { "@type": "Country", "name": "Italy" },
      { "@type": "Country", "name": "Switzerland" },
      { "@type": "Country", "name": "Austria" },
      { "@type": "Continent", "name": "Europe" }
    ],
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
            "description": "專業華語司導，深度遊覽巴黎、南法普羅旺斯、阿爾卑斯山區。"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "瑞士少女峰與多洛米蒂包車服務",
            "description": "專車接送往返蘇黎世、格林德瓦，以及北義多洛米蒂山區健行導覽。"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "義大利深度包車旅行",
            "description": "羅馬、佛羅倫斯、威尼斯、托斯卡尼私人司導服務與飯店 Check-in 協助。"
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
    <div className="flex-grow pt-0 pb-12 px-4 bg-[#FDFCF9] min-h-screen text-slate-900 font-sans">
      
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} 
      />

      <main className="max-w-5xl mx-auto py-12 md:py-20">
        
        {/* 標題區 */}
        <div className="flex flex-col items-center gap-4 mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold italic text-slate-800">
            馬上諮詢預定
          </h1>
          <div className="w-12 h-[1px] bg-[#C4A484] mx-auto mt-2"></div>
          <p className="text-slate-600 text-lg max-w-2xl mt-4 leading-relaxed">
            為提供您客製化的高品質服務，請透過我們的 LINE 官方帳號進行行程討論與預約。
          </p>
          <span className="text-slate-600 text-lg max-w-2xl mt-4 leading-relaxed">
              包含全歐境內停車費，過路費及司機小費，每天只要 
              <span className="text-[#C88A2E] font-bold text-xl md:text-2xl mx-1 underline underline-offset-4 decoration-2">
                650
              </span> 
              <span className="text-[#C88A2E] font-bold">歐元</span>
            </span>
        </div>



        {/* 預約教學與 LINE 區塊 */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center w-full">
          
          {/* 左側：預約教學 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-200/40 w-full md:w-3/5 flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <FaBookOpen className="text-[#C4A484]" /> 預約流程說明
            </h2>
            <div className="relative w-full flex-grow rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 min-h-[300px]">
              <img 
                src="/images/booking.webp" 
                alt="預約流程教學" 
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* 右側：Line 官方帳號 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-200/40 hover:border-[#C4A484]/50 transition-all flex flex-col items-center w-full md:w-2/5 justify-center">
            <div className="w-16 h-16 bg-[#00B900]/10 rounded-full flex items-center justify-center mb-6">
              <FaLine size={36} className="text-[#00B900]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Line 官方帳號</h3>
            <p className="text-slate-500 text-sm mb-8">掃描 QR Code 或點擊下方按鈕加入</p>
            
            <div className="p-3 bg-white rounded-2xl mb-8 border border-slate-100 shadow-sm">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/R/ti/p/@261RYSIY" 
                  className="w-40 h-40 object-contain mx-auto" 
                  alt="LINE 官方帳號 QR Code"
                />
            </div>
            
            <a 
              href="https://line.me/R/ti/p/@261RYSIY" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-4 bg-[#00B900] text-white text-lg rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#009900] transition-colors shadow-md active:scale-95"
            >
              <FaUserPlus size={20} /> 立即諮詢預約
            </a>
          </div>

        </div>

        {/* 最下方：聯絡信箱 */}
        <div className="mt-20 text-center border-t border-slate-200 pt-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-slate-200 shadow-sm rounded-full mb-6">
            <FaEnvelope size={24} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-800 italic mb-3">其他聯繫方式</h3>
          <p className="text-slate-500 mb-6 font-light">
            如有商務合作、企業包車或其他非即時性需求，歡迎來信：
          </p>
          <a 
            href={`mailto:${contactEmail}`} 
            className="inline-block text-xl font-medium text-[#C4A484] hover:text-slate-800 hover:underline underline-offset-8 transition-all tracking-wide"
          >
            {contactEmail}
          </a>
        </div>

      </main>
    </div>
  )
}