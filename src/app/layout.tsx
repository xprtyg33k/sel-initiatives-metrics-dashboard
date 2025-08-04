import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Initiative Metrics Dashboard',
  description: 'Analytics dashboard for organizational initiative tracking and performance metrics',
  keywords: ['initiatives', 'analytics', 'dashboard', 'metrics', 'performance'],
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
