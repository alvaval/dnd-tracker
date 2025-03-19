import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "D&D Campaign Tracker",
  description: "Manage your D&D party and characters",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        
        {/* Fixed Navbar */}
        <nav className="fixed top-0 left-0 w-full bg-gray-800 py-4 shadow-md z-50">
          <ul className="flex justify-center space-x-6">
            <li><Link href="/" className="text-white hover:text-yellow-400">Party Overview</Link></li>
            <li><Link href="/combat" className="text-white hover:text-yellow-400">Combat</Link></li>
            <li><Link href="/characters" className="text-white hover:text-yellow-400">Characters</Link></li>
            <li><Link href="/wiki" className="text-white hover:text-yellow-400">Wiki</Link></li>
            <li><Link href="/avatar" className="text-white hover:text-yellow-400">Character Customization</Link></li>
          </ul>
        </nav>

        {/* Page Content Wrapper with Scrollable Main Section */}
        <div className="flex flex-col pt-20 h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
