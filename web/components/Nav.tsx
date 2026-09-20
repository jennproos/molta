'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">Molta</Link>
        <ul className={`nav-links${open ? ' nav-open' : ''}`}>
          <li><Link href="/#about" className="nav-link" onClick={close}>About</Link></li>
          <li><Link href="/#markets" className="nav-link" onClick={close}>Markets</Link></li>
          {process.env.NEXT_PUBLIC_SERVICES_ENABLED === 'true' && (
            <li><Link href="/services" className="nav-link" onClick={close}>Services</Link></li>
          )}
          <li><Link href="/#contact" className="nav-link" onClick={close}>Contact</Link></li>
          <li>
            <a
              href="https://www.instagram.com/molta_gr/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-instagram nav-link"
              aria-label="Instagram"
              onClick={close}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </li>
        </ul>
        <button
          className={`hamburger${open ? ' is-open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
