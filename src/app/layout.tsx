"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../styles/globals.css";
import { Inknut_Antiqua, Modern_Antiqua} from "next/font/google";
import { usePathname } from "next/navigation";


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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname(); // Get current route

  const links = [
    { name: "Party Overview", path: "/", icon: "/icons/sword.svg" },
    { name: "Combat", path: "/combat", icon: "/icons/shield.svg" },
    { name: "Characters", path: "/characters", icon: "/icons/helmet.svg" },
    { name: "Wiki", path: "/wiki", icon: "/icons/book.svg" },
    { name: "Character Customization", path: "/avatar", icon: "/icons/magic.svg" }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F9F7F1]">
        
        {/* Fixed Navbar */}
        <nav className="fixed top-0 left-0 w-full h-[100px] py-4 z-50 flex justify-between px-10">
          <div className="flex">
            <span><img src="/sprites/mole.png" alt="Mole Logo" /></span>
            <span className="text-[30px] pt-5">D<span className="text-[25px]">&</span>D Campaign Tracker</span>
          </div>
          
          <ul className="flex justify-center space-x-6 pt-7 text-[16px]">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`flex items-center space-x-2 hover:underline
                    ${pathname === link.path ? "underline" : "text-black"}
                  `}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {pathname === link.path && <img src="/sprites/tinydragonborn.png" alt="" className="w-4 h-6 mr-[-15]" />}
                  </span>
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page Content Wrapper */}
        <div className="flex flex-col pt-20 h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}