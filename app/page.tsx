'use client';

import { useState, useEffect } from 'react';
import ScrapeTable from "./components/scrapeTable";
import FilterControls from "./components/FilterControls";
import { Entry } from "@/lib/types";

export default function Home() {
  const [scrapedData, setScrapedData] = useState<Entry[]>([]);
  const [filteredData, setFilteredData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'long' | 'short'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/scrape?filter=${currentFilter}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setScrapedData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentFilter]);

  const handleFilterChange = (filter: 'all' | 'long' | 'short') => {
    setCurrentFilter(filter);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="p-4">Loading...</div>;
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
      <div className="w-full">
        <FilterControls 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
          isLoading={loading}
        />
        <ScrapeTable initialData={filteredData} />
      </div>
    );
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-6xl">
        {renderContent()}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>This was scraped from Hacker News</p>
      </footer>
    </div>
  );
}
