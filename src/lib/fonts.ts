import { Geist, Geist_Mono } from "next/font/google";
import { Inknut_Antiqua, Modern_Antiqua } from "next/font/google";

export const geistSans = Geist({ variable: "--font-geist-sans" });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono" });
export const inknutAntiqua = Inknut_Antiqua({
  subsets: ["latin"],
  weight: ["400"], // Adjust weight as needed
});
export const modernAntiqua = Modern_Antiqua({
  subsets: ["latin"],
  weight: ["400"], // Adjust weight as needed
});