import { Inter } from 'next/font/google';
import './globals.css';
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
import ActiveStatus from '@/components/ActiveStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Messenger Clone',
  description: 'Messenger Clone',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ToasterContext />
        <ActiveStatus />
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
