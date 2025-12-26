import { MapPin, TrendingUp, Compass  } from "lucide-react"
import Navbar from "./Navbar"

export default function Home() {
  return (
    <div>
      
      <main>
        {/* HERO SECTION */}
        <section
          className="
            relative overflow-hidden
            bg-[radial-gradient(circle_at_top,#e0f2ff,#f0fdfb,#ffffff)]
            py-20 md:py-32
          "
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
           <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="flex items-center justify-center bg-green-100 rounded-full p-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              </div>
              <span className="text-sm font-medium bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Explore 195 countries worldwide
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 leading-tight">
              <span className="bg-[linear-gradient(90deg,#155DFC,#009689,#155DFC)] bg-clip-text text-transparent">
                Discover the World,
              </span>
              <br />
              <span className="bg-[linear-gradient(90deg,#155DFC,#009689,#155DFC)] bg-clip-text text-transparent">
                One Country at a Time
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-base md:text-lg mb-20 max-w-2xl mx-auto">
              Explore cultures, landscapes, and histories from around the globe.
              <br />
              Your journey to understanding our beautiful planet starts here.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {/* Gradient Button */}
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium
                              text-white bg-gradient-to-r from-blue-600 to-teal-500
                              hover:from-teal-500 hover:to-blue-600
                              transition duration-200 ease-in-out shadow-lg">
              <MapPin className="w-5 h-5" />
              Start Exploring
            </button>

            {/* White Button */}
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium
                              bg-white border border-gray-200 shadow-sm text-gray-600
                              hover:bg-gray-100 hover:text-gray-800 hover:shadow-md
                              transition duration-200 ease-in-out">
              <Compass className="w-5 h-5 text-gray-400" />
              <span>View Popular Destinations</span>
            </button>
          </div>


            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center gap-12 pt-8 border-t border-gray-200">
              {[
                { value: "195", label: "Countries" },
                { value: "7", label: "Continents" },
                { value: "1000+", label: "Cultural Insights" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    {item.value}
                  </div>
                  <div className="text-sm !text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>   
      </main>
    </div>
  )
}