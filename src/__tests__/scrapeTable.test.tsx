import React from 'react';
import { render, screen } from '@testing-library/react';
import ScrapeTable from '../../app/components/scrapeTable';
import { Entry } from '@/lib/types';

describe('ScrapeTable Component', () => {
  const mockEntries: Entry[] = [
    {
      id: 1,
      title: 'Test Title 1',
      points: 100,
      comments: 10
    },
    {
      id: 2,
      title: 'Test Title 2',
      points: 200,
      comments: 20
    },
    {
      id: 3,
      title: 'Test Title 3',
      points: 150,
      comments: 15
    }
  ];

  describe('Rendering', () => {
    it('should render table headers correctly', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      expect(screen.getByText('Number')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Points')).toBeInTheDocument();
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('should render all entries in the table', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      expect(screen.getByText('Test Title 1')).toBeInTheDocument();
      expect(screen.getByText('Test Title 2')).toBeInTheDocument();
      expect(screen.getByText('Test Title 3')).toBeInTheDocument();
    });

    it('should display correct row numbers', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should display points and comments correctly', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  describe('Empty Data Handling', () => {
    it('should display "No data available" when no data is provided', () => {
      render(<ScrapeTable initialData={[]} />);
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

         it('should display "No data available" when initialData is undefined', () => {
       render(<ScrapeTable />);
       
       expect(screen.getByText('No data available')).toBeInTheDocument();
     });

     it('should display "No data available" when initialData is null', () => {
       render(<ScrapeTable initialData={null as unknown as Entry[]} />);
       
       expect(screen.getByText('No data available')).toBeInTheDocument();
     });
  });

  describe('Table Structure', () => {
    it('should render a table element', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should have the correct number of rows', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const rows = screen.getAllByRole('row');
      // Header row + 3 data rows
      expect(rows).toHaveLength(4);
    });

    it('should have the correct number of columns', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const headerCells = screen.getAllByRole('columnheader');
      expect(headerCells).toHaveLength(4);
    });
  });

  describe('Data Display', () => {
         it('should handle entries with missing id', () => {
       const entriesWithoutId: Entry[] = [
         {
           id: undefined as unknown as number,
           title: 'Test Title',
           points: 100,
           comments: 10
         }
       ];
      
      render(<ScrapeTable initialData={entriesWithoutId} />);
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

         it('should handle entries with zero points and comments', () => {
       const entriesWithZeros: Entry[] = [
         {
           id: 1,
           title: 'Test Title',
           points: 0,
           comments: 0
         }
       ];
       
       render(<ScrapeTable initialData={entriesWithZeros} />);
       
       expect(screen.getByText('Test Title')).toBeInTheDocument();
       const zeroElements = screen.getAllByText('0');
       expect(zeroElements).toHaveLength(2); // One for points, one for comments
     });

    it('should handle long titles', () => {
      const longTitleEntry: Entry[] = [
        {
          id: 1,
          title: 'This is a very long title that might wrap to multiple lines in the table cell',
          points: 100,
          comments: 10
        }
      ];
      
      render(<ScrapeTable initialData={longTitleEntry} />);
      
      expect(screen.getByText('This is a very long title that might wrap to multiple lines in the table cell')).toBeInTheDocument();
    });

    it('should handle special characters in titles', () => {
      const specialCharEntry: Entry[] = [
        {
          id: 1,
          title: 'Test Title with @#$%^&*() symbols!',
          points: 100,
          comments: 10
        }
      ];
      
      render(<ScrapeTable initialData={specialCharEntry} />);
      
      expect(screen.getByText('Test Title with @#$%^&*() symbols!')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper table semantics', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(4);
    });

    it('should have proper row structure', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('Styling Classes', () => {
    it('should have overflow-x-auto wrapper', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const wrapper = screen.getByRole('table').parentElement;
      expect(wrapper).toHaveClass('overflow-x-auto');
    });

    it('should have proper table styling classes', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('min-w-full', 'bg-white', 'border', 'border-gray-300');
    });

    it('should have proper header styling', () => {
      render(<ScrapeTable initialData={mockEntries} />);
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveClass('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider', 'border-b');
      });
    });
  });

  describe('Large Dataset', () => {
    it('should handle large number of entries', () => {
      const largeDataset: Entry[] = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        title: `Test Title ${index + 1}`,
        points: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100)
      }));
      
      render(<ScrapeTable initialData={largeDataset} />);
      
      // Should render the first few entries
      expect(screen.getByText('Test Title 1')).toBeInTheDocument();
      expect(screen.getByText('Test Title 2')).toBeInTheDocument();
      
      // Should have correct number of rows (header + 100 data rows)
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(101);
    });
  });
});
