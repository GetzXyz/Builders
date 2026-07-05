import type { Metadata } from 'next';
import { Poppins, Orbitron } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' });

export const metadata: Metadata = {
  title: 'FORGE AI - Build Your Dream Gaming PC',
  description:
    'Create perfectly balanced PC builds using live component prices, AI recommendations, compatibility checking and beautiful visualizations.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${orbitron.variable}`}>
      <body>{children}</body>
    </html>
  );
}