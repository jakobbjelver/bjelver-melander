import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Your global styles (including Tailwind)
import { cn } from '@/lib/utils'; // Assumes Shadcn utility function location
import { Toaster } from '@/components/ui/sonner';
import Image from 'next/image';
import ProgressBar from '@/components/progress-bar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Experiment Simulator',
  description: 'Master Thesis Experiment Simulator',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <nav className='bg-slate-200 py-3 sticky flex flex-row items-center justify-center'>
          <Image
            src="/logo.png"
            width={150}
            height={75}
            alt="LUSEM"
            className='absolute md:left-5 right-0 md:scale-100 scale-[0.65] md:top-auto top-0'
          />
          <span>
            <p className="md:text-center text-left font-bold md:text-xl text-lg md:mt-0 mt-1">Experiment Simulator</p>
            <p className='italic md:text-sm text-xs md:mt-1 mt-3'>Jakob Bjelvér & Erik Melander, Department of Informatics</p>
          </span>
        </nav>
        <ProgressBar />
        <main className="container mx-auto p-2 md:p-8">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}