import { Entry } from './types';

export interface FilterOptions {
  type: 'long' | 'short';
  sortBy: 'comments' | 'points';
}

export function countWords(title: string): number {
  // Remove symbols and extra spaces, then count words
  // Keep hyphens only when they're part of a word (not standalone)
  const cleanTitle = title.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanTitle.split(' ').filter(word => word.length > 0 && word !== '-');
  return words.length;
}

export function filterEntries(entries: Entry[], options: FilterOptions): Entry[] {
  const { type, sortBy } = options;
  
  return entries
    .filter(entry => {
      const wordCount = countWords(entry.title);
      return type === 'long' ? wordCount > 5 : wordCount <= 5;
    })
    .sort((a, b) => {
      if (sortBy === 'comments') {
        return b.comments - a.comments; // Descending
      } else {
        return b.points - a.points; // Descending
      }
    });
}

export function getFilteredData(entries: Entry[], filterType: 'long' | 'short' | 'all'): Entry[] {
  if (filterType === 'all') return entries;
  
  const options: FilterOptions = {
    type: filterType,
    sortBy: filterType === 'long' ? 'comments' : 'points'
  };
  
  return filterEntries(entries, options);
}
