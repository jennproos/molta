'use client';

import { useEffect, useRef } from 'react';

const ITEMS = [
  '🥐 very good bread 🥐',
  '🌾 organic stone ground wheat 🌾',
  '💚 made with love 💚',
  '📍 grand rapids, mi 📍',
];

export default function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const origHTML = track.innerHTML;
    const origWidth = track.scrollWidth;
    let safety = 0;
    while (track.scrollWidth < window.innerWidth * 2.5 && safety++ < 30) {
      track.insertAdjacentHTML('beforeend', origHTML);
    }
    track.style.setProperty('--ticker-move', `-${origWidth}px`);
  }, []);

  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track" ref={trackRef}>
        {ITEMS.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
