export default function ExploreMoreSection() {
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl">
            Start Exploring
          </button>
          
          <button className="bg-white hover:bg-gray-50 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 border border-gray-200">
            <svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            View My Favorites
          </button>
        </div>
      </div>
    </div>
  );
}