'use client'

type ExploreFilterProps = {
  onApply: () => void;
};

export default function ExploreFilter({ onApply }: ExploreFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 max-w-5xl">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Explore Countries
      </h2>

      {/* Pagination */}
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        <button className="hover:text-blue-600">First</button>
        <button className="hover:text-blue-600">‹</button>

        <span className="px-3 py-1 bg-green-500 text-white rounded-md">
          1
        </span>

        <button className="hover:text-blue-600">›</button>
        <button className="hover:text-blue-600">Last</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Sort By */}
        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Sort by</option>
          <option>Name (A–Z)</option>
          <option>Population</option>
          <option>Area</option>
        </select>

        {/* Region */}
        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Region</option>
          <option>Asia</option>
          <option>Europe</option>
          <option>Africa</option>
          <option>Americas</option>
          <option>Oceania</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search countries..."
          className="border rounded-lg px-3 py-2 text-sm w-56"
        />

        {/* Apply */}
        <button
          onClick={onApply}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
        >
          <i className="pi pi-filter"></i>
          Apply filter
        </button>
      </div>
    </div>
  );
}
