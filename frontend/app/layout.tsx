// app/layout.tsx
import Link from 'next/link';
import './globals.css'; // Assuming Tailwind is configured here

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              ArtMarket Navigator
            </Link>
            <div className="space-x-4">
              <Link href="/" className="text-sm font-medium hover:text-blue-600">Events</Link>
              <Link href="/admin" className="text-sm font-medium hover:text-blue-600">Admin Dashboard</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}