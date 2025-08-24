import { getFilteredData } from '@/lib/filters';
import { Entry } from '@/lib/types';

describe('API Scrape Route Logic', () => {
  describe('Filtering Logic', () => {
    it('should handle filtering logic correctly', () => {
      const mockEntries: Entry[] = [
        {
          id: 1,
          title: 'This is a very long title with many words',
          points: 100,
          comments: 50
        },
        {
          id: 2,
          title: 'Short',
          points: 200,
          comments: 10
        }
      ];

      // Test filtering logic
      const longFiltered = getFilteredData(mockEntries, 'long');
      expect(longFiltered).toHaveLength(1);
      expect(longFiltered[0].title).toBe('This is a very long title with many words');

      const shortFiltered = getFilteredData(mockEntries, 'short');
      expect(shortFiltered).toHaveLength(1);
      expect(shortFiltered[0].title).toBe('Short');

      const allFiltered = getFilteredData(mockEntries, 'all');
      expect(allFiltered).toHaveLength(2);
    });

    it('should handle empty data gracefully', () => {
      const emptyEntries: Entry[] = [];
      
      const result = getFilteredData(emptyEntries, 'all');
      expect(result).toHaveLength(0);
      
      const longResult = getFilteredData(emptyEntries, 'long');
      expect(longResult).toHaveLength(0);
      
      const shortResult = getFilteredData(emptyEntries, 'short');
      expect(shortResult).toHaveLength(0);
    });

    it('should sort long titles by comments', () => {
      const mockEntries: Entry[] = [
        {
          id: 1,
          title: 'This is a very long title with many words in it',
          points: 100,
          comments: 30
        },
        {
          id: 2,
          title: 'This is another very long title with many words in it too',
          points: 200,
          comments: 50
        }
      ];

      const longFiltered = getFilteredData(mockEntries, 'long');
      expect(longFiltered).toHaveLength(2);
      expect(longFiltered[0].comments).toBe(50); // Should be sorted by comments descending
      expect(longFiltered[1].comments).toBe(30);
    });

    it('should sort short titles by points', () => {
      const mockEntries: Entry[] = [
        {
          id: 1,
          title: 'Short',
          points: 100,
          comments: 30
        },
        {
          id: 2,
          title: 'Also short',
          points: 200,
          comments: 50
        }
      ];

      const shortFiltered = getFilteredData(mockEntries, 'short');
      expect(shortFiltered).toHaveLength(2);
      expect(shortFiltered[0].points).toBe(200); // Should be sorted by points descending
      expect(shortFiltered[1].points).toBe(100);
    });
  });
});
