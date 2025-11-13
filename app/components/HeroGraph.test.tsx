import { render, screen } from '@testing-library/react';
import { HeroGraph } from './HeroGraph';
import { Hero, Film, Starship } from '../types';
import { Node, Edge } from 'reactflow';

// --- Mocking the 'reactflow' library ---

// Capture the props passed to the <ReactFlow /> component
let capturedNodes: Node[] = [];
let capturedEdges: Edge[] = [];

// Mock the entire 'reactflow' module
jest.mock('reactflow', () => ({
  __esModule: true, // Needed for modules with default exports

  // Mock the default export (the <ReactFlow /> component)
  default: (props: { nodes: Node[]; edges: Edge[]; children: React.ReactNode }) => {
    // CAPTURE the props for our assertions
    capturedNodes = props.nodes;
    capturedEdges = props.edges;
    // Render children to make sure <Background /> shows up
    return <div data-testid="mock-react-flow">{props.children}</div>;
  },

  // Mock the named exports
  Background: () => <div data-testid="mock-background" />,
  Controls: () => null, // not using
  MiniMap: () => null, // not using
}));

// --- Test Suite ---

describe('HeroGraph Component', () => {
  // Prepare our mock data
  const mockHero: Hero = {
    name: 'Luke Skywalker',
    films: ['film-url-1'],
    starships: ['starship-url-1'],
  } as Hero;

  const mockFilm: Film = {
    episode_id: 4,
    title: 'A New Hope',
    starships: ['starship-url-1'],
  } as Film;

  const mockStarship: Starship = {
    name: 'X-Wing',
  } as Starship;

  const mockFilmsWithStarships = [
    {
      film: mockFilm,
      starships: [mockStarship],
    },
  ];

  // Reset captured props before each test
  beforeEach(() => {
    capturedNodes = [];
    capturedEdges = [];
  });

  it('should generate correct nodes and edges from props', () => {
    // Act: Render the component with our mock data
    render(<HeroGraph hero={mockHero} filmsWithStarships={mockFilmsWithStarships} />);

    // Assert: Check that our mock ReactFlow and Background were rendered
    expect(screen.getByTestId('mock-react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('mock-background')).toBeInTheDocument();

    // --- Assert Nodes ---
    // Expect 1 Hero + 1 Film + 1 Starship = 3 nodes total
    expect(capturedNodes).toHaveLength(3);

    // Check for the Hero node
    expect(capturedNodes).toContainEqual(
      expect.objectContaining({
        id: 'hero-Luke Skywalker',
        data: { label: 'Luke Skywalker' },
      }),
    );

    // Check for the Film node
    expect(capturedNodes).toContainEqual(
      expect.objectContaining({
        id: 'film-4', // from episode_id
        data: { label: 'A New Hope' },
      }),
    );

    // Check for the Starship node
    expect(capturedNodes).toContainEqual(
      expect.objectContaining({
        id: 'starship-4-X-Wing', // from episode_id and starship name
        data: { label: 'X-Wing' },
      }),
    );

    // --- Assert Edges ---
    // Expect 1 (Hero -> Film) + 1 (Film -> Starship) = 2 edges total
    expect(capturedEdges).toHaveLength(2);

    // Check for the Hero-to-Film edge
    expect(capturedEdges).toContainEqual(
      expect.objectContaining({
        id: 'hero-film-4',
        source: 'hero-Luke Skywalker',
        target: 'film-4',
      }),
    );

    // Check for the Film-to-Starship edge
    expect(capturedEdges).toContainEqual(
      expect.objectContaining({
        id: 'film-starship-4-X-Wing',
        source: 'film-4',
        target: 'starship-4-X-Wing',
      }),
    );
  });
});
