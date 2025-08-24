import { countWords, filterEntries, getFilteredData } from '@/lib/filters';
import { Entry } from '@/lib/types';

describe('Filter Functions', () => {
  const mockEntries: Entry[] = [
    { id: 1, title: 'This is a short title', points: 100, comments: 10 },
    { id: 2, title: 'This is a much longer title with more words', points: 50, comments: 20 },
    { id: 3, title: 'Short', points: 200, comments: 5 },
    { id: 4, title: 'This - has symbols! and @#$%^&*()', points: 75, comments: 15 },
  ];

  describe('countWords', () => {
    it('should count words correctly excluding symbols', () => {
      expect(countWords('This is - a self-explained example')).toBe(5);
      expect(countWords('Short')).toBe(1);
      expect(countWords('This - has symbols! and @#$%^&*()')).toBe(4);
      expect(countWords('')).toBe(0);
    });



    it('should handle multiple spaces and special characters', () => {
      expect(countWords('  Multiple    spaces  ')).toBe(2);
      expect(countWords('Word1!@#$%^&*()Word2')).toBe(2);
      expect(countWords('123 456 789')).toBe(3);
    });
  });

  describe('filterEntries', () => {
    it('should filter long titles and sort by comments', () => {
      const result = filterEntries(mockEntries, { type: 'long', sortBy: 'comments' });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('This is a much longer title with more words');
      expect(result[0].comments).toBe(20);
    });

    it('should filter short titles and sort by points', () => {
      const result = filterEntries(mockEntries, { type: 'short', sortBy: 'points' });
      expect(result).toHaveLength(3);
      expect(result[0].points).toBe(200); // Short title with highest points
      expect(result[1].points).toBe(100);
      expect(result[2].points).toBe(75);
    });

    it('should handle empty array', () => {
      const result = filterEntries([], { type: 'long', sortBy: 'comments' });
      expect(result).toHaveLength(0);
    });
  });

  describe('getFilteredData', () => {
    it('should return all entries when filter is "all"', () => {
      const result = getFilteredData(mockEntries, 'all');
      expect(result).toHaveLength(4);
    });

    it('should apply correct filtering and sorting for long titles', () => {
      const result = getFilteredData(mockEntries, 'long');
      expect(result).toHaveLength(1);
      expect(result[0].comments).toBe(20); // Should be sorted by comments
    });

    it('should apply correct filtering and sorting for short titles', () => {
      const result = getFilteredData(mockEntries, 'short');
      expect(result).toHaveLength(3);
      expect(result[0].points).toBe(200); // Should be sorted by points
    });

    it('should handle edge cases with exactly 5 words', () => {
      const edgeCaseEntries: Entry[] = [
        { id: 1, title: 'One two three four five', points: 100, comments: 10 },
        { id: 2, title: 'One two three four five six', points: 50, comments: 20 },
      ];
      
      const shortResult = getFilteredData(edgeCaseEntries, 'short');
      expect(shortResult).toHaveLength(1);
      expect(shortResult[0].title).toBe('One two three four five');
      
      const longResult = getFilteredData(edgeCaseEntries, 'long');
      expect(longResult).toHaveLength(1);
      expect(longResult[0].title).toBe('One two three four five six');
    });
  });
});
