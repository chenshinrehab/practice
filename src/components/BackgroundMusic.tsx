// components/BackgroundMusic.tsx
'use client'

import React, { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 設定初始音量，避免太大聲嚇到客人 (0.3 = 30% 音量)
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

    const startAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // 如果瀏覽器依然攔截，這是在背景靜默失敗，不會報錯影響使用者
        });
        // 成功播放後，移除監聽器
        window.removeEventListener('click', startAudio);
        window.removeEventListener('scroll', startAudio);
        window.removeEventListener('touchstart', startAudio);
      }
    };

    // 監聽使用者的各種互動行為來觸發播放
    window.addEventListener('click', startAudio);
    window.addEventListener('scroll', startAudio);
    window.addEventListener('touchstart', startAudio);

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, []);

  return (
    <audio ref={audioRef} loop className="hidden">
      <source src="/music/background-jazz.mp3" type="audio/mpeg" />
    </audio>
  );
}