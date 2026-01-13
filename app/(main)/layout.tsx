import { ThemeProvider } from "next-themes";
import Footer from "./user/components/util/Footer";
import Navbar from "./user/components/util/Navbar";
import { Suspense } from "react";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar/>
      </Suspense>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
        {children}
      </main>
      <Footer/>
    </>
  );
}