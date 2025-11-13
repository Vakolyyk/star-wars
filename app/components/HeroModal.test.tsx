import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeroModal } from './HeroModal';
import { getHeroDetails } from '../actions/hero';
import { Hero, Film, Starship } from '../types';

jest.mock('../actions/hero', () => ({
  getHeroDetails: jest.fn(),
}));

// Want to check THAT it renders and WHAT props it receives
jest.mock('./HeroGraph', () => ({
  HeroGraph: ({ hero, filmsWithStarships }: any) => (
    <div data-testid="mock-hero-graph">
      {/* We can "spy" on the props to ensure they are correct */}
      <span data-testid="graph-hero-name">{hero.name}</span>
      <span data-testid="graph-film-count">{filmsWithStarships.length}</span>
    </div>
  ),
}));

// Type our mocked action
const mockedGetHeroDetails = getHeroDetails as jest.Mock;

// --- Test Data ---
const mockHero: Hero = { name: 'Luke Skywalker' } as Hero;

const mockDetailsResponse = {
  hero: mockHero,
  films: [
    { film: { title: 'A New Hope' } as Film, starships: [] as Starship[] },
    { film: { title: 'The Empire Strikes Back' } as Film, starships: [] as Starship[] },
  ],
};

// --- Test Suite ---

describe('HeroModal Component', () => {
  // Create a mock function for the onClose prop
  const mockOnClose = jest.fn();

  // Clear mocks and console spies before each test
  beforeEach(() => {
    mockedGetHeroDetails.mockClear();
    mockOnClose.mockClear();
    // Silence console.error for the error test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render null when isOpen is false', () => {
    // Arrange: Render with isOpen={false}
    const { container } = render(
      <HeroModal isOpen={false} onClose={mockOnClose} hero={mockHero} />,
    );

    // Assert: The component should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('should render null when hero is null', () => {
    // Arrange: Render with hero={null}
    const { container } = render(<HeroModal isOpen={true} onClose={mockOnClose} hero={null} />);

    // Assert: The component should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('should show loading, fetch details, and render graph when opened', async () => {
    // Arrange: Set up the mock to return data
    mockedGetHeroDetails.mockResolvedValue(mockDetailsResponse);

    // Act: Render the modal (it's open)
    render(<HeroModal isOpen={true} onClose={mockOnClose} hero={mockHero} />);

    // Assert: Check loading state
    expect(screen.getByText('Loading details...')).toBeInTheDocument();

    // Assert: Check that the action was called with the correct hero
    expect(mockedGetHeroDetails).toHaveBeenCalledWith(mockHero);
    expect(mockedGetHeroDetails).toHaveBeenCalledTimes(1);

    // Assert: Wait for the loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading details...')).not.toBeInTheDocument();
    });

    // Assert: Check success state (the mock graph is rendered)
    expect(screen.getByTestId('mock-hero-graph')).toBeInTheDocument();

    // Check that the graph received the correct props
    expect(screen.getByTestId('graph-hero-name')).toHaveTextContent('Luke Skywalker');
    expect(screen.getByTestId('graph-film-count')).toHaveTextContent('2'); // From our mockDetailsResponse
  });

  it('should call onClose when the close button is clicked', async () => {
    // Arrange
    mockedGetHeroDetails.mockResolvedValue(mockDetailsResponse);
    render(<HeroModal isOpen={true} onClose={mockOnClose} hero={mockHero} />);

    // Wait for content to load so the button is definitely there
    await waitFor(() => {
      expect(screen.getByTestId('mock-hero-graph')).toBeInTheDocument();
    });

    // Act: Click the close button
    fireEvent.click(screen.getByText('✖'));

    // Assert: The prop function was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle and log an error during fetch', async () => {
    // Arrange: Mock a failed request
    mockedGetHeroDetails.mockRejectedValue(new Error('Test Error'));
    render(<HeroModal isOpen={true} onClose={mockOnClose} hero={mockHero} />);

    // Assert: Loading state is still shown first
    expect(screen.getByText('Loading details...')).toBeInTheDocument();

    // Assert: Wait for loading to finish (even on error)
    await waitFor(() => {
      expect(screen.queryByText('Loading details...')).not.toBeInTheDocument();
    });

    // Assert: Error state
    expect(console.error).toHaveBeenCalledWith('Failed to fetch hero details', expect.any(Error));
    // The graph should not be rendered
    expect(screen.queryByTestId('mock-hero-graph')).not.toBeInTheDocument();
  });
});
