import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./user/countries/components/Navbar";
import Footer from "./user/countries/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar/>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}