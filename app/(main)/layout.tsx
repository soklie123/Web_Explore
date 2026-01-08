import Footer from "../user/countries/components/Footer";
import Navbar from "../user/countries/components/Navbar";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
        {children}
      </main>
      <Footer/>
    </>
  );
}