import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Your global styles (including Tailwind)
import { cn } from '@/lib/utils'; // Assumes Shadcn utility function location
import { BackNavigationGuard } from '@/components/back-navigation-guard';
import { Toaster } from '@/components/ui/sonner';

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
        {/* Add ThemeProvider here if using Shadcn themes */}
        <main className="container mx-auto p-4 md:p-8">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}