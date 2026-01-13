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
  
  const totalPages = Math.ceil(totalCountries / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFirst = () => handlePageChange(1)
  const handlePrevious = () => handlePageChange(currentPage - 1)
  const handleNext = () => handlePageChange(currentPage + 1)
  const handleLast = () => handlePageChange(totalPages)

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

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, currentPage + 2)
      
      if (currentPage <= 3) {
        endPage = maxVisible
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisible + 1
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  const hasActiveFilters = search || region || sort

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Explore Countries
          </h1>
          
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        
        <p className="text-gray-600">
          Discover and learn about {totalCountries.toLocaleString()} countries around the world
        </p>
      </div>

      {/* Search Bar - Primary Action */}
      <div className="mb-6">
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            placeholder="Search by country name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-12 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-gray-400"
          />
          
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all bg-white"
          >
            <option value="">All Regions</option>
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
            <option value="africa">Africa</option>
            <option value="americas">Americas</option>
            <option value="oceania">Oceania</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all bg-white"
          >
            <option value="">Default Order</option>
            <option value="name">Name (A–Z)</option>
            <option value="population">Population</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between py-4 border-y border-gray-200">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{totalCountries}</span> {totalCountries === 1 ? 'country' : 'countries'}
          {hasActiveFilters && <span className="text-gray-500"> (filtered)</span>}
        </div>
        
        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button 
            onClick={handleFirst}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="First page"
          >
            First
          </button>
          
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1 mx-2">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Last page"
          >
            Last
          </button>
        </div>
      )}
      
    </div>
  )
}