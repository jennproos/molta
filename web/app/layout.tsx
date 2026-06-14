import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Molta Bakery',
  description: 'damn good bread — Grand Rapids, MI',
  openGraph: {
    title: 'Molta Bakery',
    description: 'damn good bread — Grand Rapids, MI',
    url: 'https://moltabakery.com/',
    images: [{ url: 'https://moltabakery.com/images/molta-popup.jpeg' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=BBH+Sans+Hegarty&family=SN+Pro:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
