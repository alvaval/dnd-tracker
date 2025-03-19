import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";
import { Inknut_Antiqua, Modern_Antiqua} from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono" });
const inknutAntiqua = Inknut_Antiqua({
  subsets: ["latin"],
  weight: ["400"], // Adjust weight as needed
});
const modernAntiqua = Modern_Antiqua({
  subsets: ["latin"],
  weight: ["400"], // Adjust weight as needed
});

export const metadata: Metadata = {
  title: "D&D Campaign Tracker",
  description: "Manage your D&D party and characters",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#F9F7F1]`}>
        
        {/* Fixed Navbar */}
        <nav className={`${inknutAntiqua.className} fixed top-0 left-0 w-full h-[100px] py-4 z-50 flex justify-between px-10`}>
          <div className="flex">
          <span><img src="/sprites/mole.png"></img></span>
          <span className="text-[30px] pt-5">D<span className={`${modernAntiqua.className} text-[25px]`}>&</span>D Campaign Tracker</span>
          </div>
          <ul className="flex justify-center space-x-6 pt-7 text-[16px]">
            <li><Link href="/" className="hover:underline">Party Overview</Link></li>
            <li><Link href="/combat" className="hover:underline">Combat</Link></li>
            <li><Link href="/characters" className="hover:underline">Characters</Link></li>
            <li><Link href="/wiki" className="hover:underline">Wiki</Link></li>
            <li><Link href="/avatar" className="hover:underline">Character Customization</Link></li>
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
