'use client'

import React from "react"

type ExploreFilterProps = {
  search: string
  region: string
  sort: string
  onFilterChange: (filters: { search: string; region: string; sort: string }) => void
  resultCount?: number
  totalCountries: number
  currentPage: number
  onPageChange: (page: number) => void
  itemsPerPage: number
}

export default function ExploreFilter({ 
  search, 
  region, 
  sort, 
  onFilterChange,
  resultCount,
  totalCountries,
  currentPage,
  onPageChange,
  itemsPerPage
}: ExploreFilterProps) {
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCountries / itemsPerPage)

  // ----------------------
  // Pagination Handlers
  // ----------------------
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFirst = () => handlePageChange(1)
  const handlePrevious = () => handlePageChange(currentPage - 1)
  const handleNext = () => handlePageChange(currentPage + 1)
  const handleLast = () => handlePageChange(totalPages)

  // ----------------------
  // Filter Handlers
  // ----------------------
  const handleSearchChange = (value: string) => {
    onFilterChange({ search: value, region, sort })
  }

  const handleRegionChange = (value: string) => {
    onFilterChange({ search, region: value, sort })
  }

  const handleSortChange = (value: string) => {
    onFilterChange({ search, region, sort: value })
  }

  const handleReset = () => {
    onFilterChange({ search: "", region: "", sort: "" })
  }

  // ----------------------
  // Generate page numbers to display
  // ----------------------
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // Show max 5 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Smart pagination: show pages around current page
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, currentPage + 2)
      
      // Adjust if near the start
      if (currentPage <= 3) {
        endPage = maxVisible
      }
      
      // Adjust if near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisible + 1
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-6xl mx-auto mt-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Explore Countries
        </h2>
        
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-5">
        {/* Sort By */}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          <option value="">Sort by</option>
          <option value="name">Name (A–Z)</option>
          <option value="population">Population</option>
        </select>

        {/* Region */}
        <select
          value={region}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          <option value="">All Regions</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="oceania">Oceania</option>
        </select>

        {/* Reset Button - Only show when filters are active */}
        {(search || region || sort) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <i className="pi pi-times"></i>
            Reset Filters
          </button>
        )}

        {/* Result Count */}
        {resultCount !== undefined && (
          <div className="ml-auto text-sm text-gray-600">
            <span className="font-semibold">{totalCountries}</span> countries found
            {totalCountries > 0 && totalPages > 1 && (
              <span className="text-gray-500">
                {" "}• Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 justify-center mt-4">
          {/* First Button */}
          <button 
            onClick={handleFirst}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded transition ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            First
          </button>
          
          {/* Previous Button */}
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded transition ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            ‹
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded-md font-medium transition ${
                currentPage === pageNum
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Button */}
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded transition ${
              currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            ›
          </button>
          
          {/* Last Button */}
          <button 
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded transition ${
              currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Last
          </button>
          
        </div>
        
      )}
      
      <div className="flex relative md:w-100 justify-cente mx-auto ">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i className="pi pi-search"></i>
          </span>
          
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-10 py-2 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          
          {/* Clear search button */}
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      
    </div>
  )
}