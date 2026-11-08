import Header from './header';
import './globals.css';

export const metadata = {
  title: 'Pro Alifbo — matn konvertori',
  description: 'O‘zbek lotin, kirill va yangi alifbo orasida matnni o‘giring.',
  icons: { icon: '/assets/logo.png' }
};

export default function Layout({ children }) {
  return <html lang="uz"><body><Header />{children}</body></html>;
}

