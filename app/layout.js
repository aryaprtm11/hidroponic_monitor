import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Hidroponic Monitoring',
  description: 'Monitor your hydroponic system in real-time',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="min-h-screen flex justify-center bg-[#f6f6f6]">
          <div className="w-full max-w-[430px] bg-[#f6f6f6]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
