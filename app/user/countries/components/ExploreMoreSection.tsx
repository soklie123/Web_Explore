'use client'

import { useRouter } from "next/navigation";
import ExploreButton from "../function/ExploreButton";

export default function ExploreMoreSection() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/user/favorite"); // navigate to the favorites page
  };
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Ready to Explore More?
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Dive deeper into the world&apos;s countries and discover fascinating facts, stunning imagery,
          and cultural insights that will inspire your next adventure.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ExploreButton/>
          
          {/* View Favorites */}
          <button
            onClick={handleClick}
            className="flex items-center justify-center gap-2
                       bg-white hover:bg-gray-50
                       text-gray-800 font-medium
                       px-8 py-3 rounded-full
                       transition-colors duration-200
                       shadow-md hover:shadow-lg
                       border border-gray-200"
          >
            <i className="pi pi-heart text-lg text-gray-500"></i>
            View My Favorites
          </button>
        </div>
      </div>
    </div>
  );
}