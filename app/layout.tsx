import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'AURELIS — Architecture & Build | Bengaluru',
  description: 'Contemporary architecture, interiors and construction for residential and commercial spaces.',
  openGraph: { title: 'AURELIS — Architecture & Build', description: 'Spaces designed to endure.', type: 'website', locale: 'en_IN' },
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { '@context':'https://schema.org', '@type':'ProfessionalService', name:site.brand, description:'Fictional architecture and build studio demonstration.', address:{'@type':'PostalAddress',streetAddress:site.address,addressLocality:'Bengaluru',addressCountry:'IN'}, telephone:site.phone, email:site.email };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>{children}</body></html>;
}
