import Footer from "./countries/components/Footer";
import Navbar from "./countries/components/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50">
      <Navbar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
        {children}
      </main>
      <Footer/>
    </div>
  );
}