'use client';

interface FilterControlsProps {
  currentFilter: 'all' | 'long' | 'short';
  onFilterChange: (filter: 'all' | 'long' | 'short') => void;
  isLoading: boolean;
}

export default function FilterControls({ currentFilter, onFilterChange, isLoading }: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">Filter by title length:</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange('all')}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            All Entries
          </button>
          <button
            onClick={() => onFilterChange('long')}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'long'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Long Titles (&gt;5 words)
          </button>
          <button
            onClick={() => onFilterChange('short')}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'short'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Short Titles (&le;5 words)
          </button>
        </div>
      </div>
      
      {currentFilter !== 'all' && (
        <div className="flex items-end">
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
            {currentFilter === 'long' 
              ? 'Sorted by comments (descending)'
              : 'Sorted by points (descending)'
            }
          </div>
        </div>
      )}
    </div>
  );
}
