import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FORGE AI PC Builder',
  description: 'AI-powered PC build recommendations optimized for your budget',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}