import { api } from '../lib/api';
import { getStarships, getStarshipById } from './starship';
import { Starship } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedApiGet = api.get as jest.Mock;

describe('Starship Service (app/actions/starship.ts)', () => {
  // Clear mock call history before each test
  beforeEach(() => {
    mockedApiGet.mockClear();
  });

  // === Tests for getStarships ===
  describe('getStarships', () => {
    it('should successfully fetch a list of starships', async () => {
      const mockResponse: Paginated<Starship> = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'X-Wing' } as Starship],
      };
      
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getStarships(1);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith('/starships/?page=1');
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getStarships(1)).rejects.toThrow(`Cannot fetch starships: ${errorMessage}`);
    });
  });

  // === Tests for getStarshipById ===
  describe('getStarshipById', () => {
    it('should successfully fetch a starship by ID', async () => {
      const starshipId = 9;
      const mockResponse: Starship = { name: 'Death Star' } as Starship;
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getStarshipById(starshipId);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith(`/starships/${starshipId}/`);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const starshipId = 99;
      const errorMessage = 'Not Found';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));
      
      await expect(getStarshipById(starshipId)).rejects.toThrow(
        `Cannot fetch starship ${starshipId}: ${errorMessage}`
      );
    });
  });
});