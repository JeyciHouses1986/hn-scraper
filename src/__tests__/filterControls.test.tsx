import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterControls from '../../app/components/FilterControls';

describe('FilterControls Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all filter buttons', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      expect(screen.getByText('All Entries')).toBeInTheDocument();
      expect(screen.getByText('Long Titles (>5 words)')).toBeInTheDocument();
      expect(screen.getByText('Short Titles (≤5 words)')).toBeInTheDocument();
    });

    it('should render the filter label', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      expect(screen.getByText('Filter by title length:')).toBeInTheDocument();
    });

    it('should show sorting information for long filter', () => {
      render(
        <FilterControls
          currentFilter="long"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      expect(screen.getByText('Sorted by comments (descending)')).toBeInTheDocument();
    });

    it('should show sorting information for short filter', () => {
      render(
        <FilterControls
          currentFilter="short"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      expect(screen.getByText('Sorted by points (descending)')).toBeInTheDocument();
    });

    it('should not show sorting information for all filter', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      expect(screen.queryByText('Sorted by comments (descending)')).not.toBeInTheDocument();
      expect(screen.queryByText('Sorted by points (descending)')).not.toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call onFilterChange when All Entries button is clicked', () => {
      render(
        <FilterControls
          currentFilter="long"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByText('All Entries'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    });

    it('should call onFilterChange when Long Titles button is clicked', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByText('Long Titles (>5 words)'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('long');
    });

    it('should call onFilterChange when Short Titles button is clicked', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByText('Short Titles (≤5 words)'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('short');
    });
  });

  describe('Active State Styling', () => {
    it('should highlight the active filter button', () => {
      render(
        <FilterControls
          currentFilter="long"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      const longButton = screen.getByText('Long Titles (>5 words)');
      expect(longButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should not highlight inactive filter buttons', () => {
      render(
        <FilterControls
          currentFilter="long"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      const allButton = screen.getByText('All Entries');
      const shortButton = screen.getByText('Short Titles (≤5 words)');
      
      expect(allButton).toHaveClass('bg-gray-200', 'text-gray-700');
      expect(shortButton).toHaveClass('bg-gray-200', 'text-gray-700');
    });
  });

  describe('Loading State', () => {
    it('should disable buttons when loading', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={true}
        />
      );

      const allButton = screen.getByText('All Entries');
      const longButton = screen.getByText('Long Titles (>5 words)');
      const shortButton = screen.getByText('Short Titles (≤5 words)');

      expect(allButton).toBeDisabled();
      expect(longButton).toBeDisabled();
      expect(shortButton).toBeDisabled();
    });

    it('should add loading styles when loading', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={true}
        />
      );

      const allButton = screen.getByText('All Entries');
      expect(allButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not call onFilterChange when buttons are disabled', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={true}
        />
      );

      fireEvent.click(screen.getByText('Long Titles (>5 words)'));
      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

         it('should have proper labels', () => {
       render(
         <FilterControls
           currentFilter="all"
           onFilterChange={mockOnFilterChange}
           isLoading={false}
         />
       );

       expect(screen.getByText('Filter by title length:')).toBeInTheDocument();
     });
  });

    it('should have proper gap spacing', () => {
      render(
        <FilterControls
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isLoading={false}
        />
      );

      const buttonContainer = screen.getByText('All Entries').closest('div');
      expect(buttonContainer).toHaveClass('flex', 'gap-2');
    });
  });