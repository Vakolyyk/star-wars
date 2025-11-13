import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeroesList } from './HeroesList';
import { getHeroes } from '../actions/hero';
import { Hero } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../actions/hero', () => ({
  getHeroes: jest.fn(),
}));

// Mock HeroModal so we don't test its logic here
// Just check if it opens/closes
jest.mock('./HeroModal', () => ({
  HeroModal: ({ isOpen, hero }: { isOpen: boolean; hero: Hero | null }) =>
    isOpen ? (
      <div data-testid="hero-modal">
        {/* Show hero name to check if the correct hero is passed */}
        Modal for {hero?.name}
      </div>
    ) : null,
}));

// Type our mock
const mockedGetHeroes = getHeroes as jest.Mock;

describe('HeroesList Component', () => {
  // Prepare mock data
  const mockPage1: Paginated<Hero> = {
    count: 20,
    next: 'http://.../page=2',
    previous: null,
    results: [{ name: 'Luke Skywalker' } as Hero],
  };

  const mockPage2: Paginated<Hero> = {
    count: 20,
    next: null,
    previous: 'http://.../page=1',
    results: [{ name: 'Darth Vader' } as Hero],
  };

  // Clear mocks before each test
  beforeEach(() => {
    mockedGetHeroes.mockClear();
    // Silence console.error since we expect an error in one test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should show "Loading..." and then render heroes', async () => {
    // Arrange: Set up mock to return page 1 data
    mockedGetHeroes.mockResolvedValue(mockPage1);

    // Act: Render the component
    render(<HeroesList />);

    // Assert: First check the loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Wait for useEffect to run and data to "arrive"
    await waitFor(() => {
      // "Loading..." should disappear
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      // The hero should appear
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    // Check that our action was called with the correct page
    expect(mockedGetHeroes).toHaveBeenCalledWith(1);
    // "Prev" button should be disabled
    expect(screen.getByText('Prev')).toBeDisabled();
    // Total pages 2 (20 / 10 = 2)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should navigate to the next page on "Next" click', async () => {
    // Arrange: Mock for page 1, then for page 2
    mockedGetHeroes
      .mockResolvedValueOnce(mockPage1) // First call (useEffect)
      .mockResolvedValueOnce(mockPage2); // Second call (click)

    // Act: Render
    render(<HeroesList />);

    // Assert: Wait for page 1 to load
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    // Act: Click "Next"
    fireEvent.click(screen.getByText('Next'));

    // Assert: "Loading..." should appear
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Wait for page 2 to load
    await waitFor(() => {
      expect(screen.getByText('Darth Vader')).toBeInTheDocument();
    });

    // "Luke" from page 1 should disappear
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    // "Prev" button should now be enabled
    expect(screen.getByText('Prev')).toBeEnabled();
    // Check that action was called a second time with page=2
    expect(mockedGetHeroes).toHaveBeenCalledWith(2);
    expect(mockedGetHeroes).toHaveBeenCalledTimes(2);
  });

  it('should open the modal on hero click', async () => {
    // Arrange
    mockedGetHeroes.mockResolvedValue(mockPage1);

    // Act
    render(<HeroesList />);

    // Assert: Wait for load
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    // Assert: Modal window is closed
    expect(screen.queryByTestId('hero-modal')).not.toBeInTheDocument();

    // Act: Click on the hero
    fireEvent.click(screen.getByText('Luke Skywalker'));

    // Assert: Modal window is open and shows the correct hero
    await waitFor(() => {
      expect(screen.getByTestId('hero-modal')).toBeInTheDocument();
      expect(screen.getByText('Modal for Luke Skywalker')).toBeInTheDocument();
    });
  });

  it('should handle error during fetch', async () => {
    // Arrange: Mock throws an error
    mockedGetHeroes.mockRejectedValue(new Error('Failed to fetch'));

    // Act
    render(<HeroesList />);

    // Assert: Wait for "Loading..." to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Assert: Since data didn't load, the hero list should be empty
    // (not rendering 'Luke Skywalker')
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    // Check if the error was logged to console
    expect(console.error).toHaveBeenCalledWith('Failed to fetch heroes', expect.any(Error));
  });
});
