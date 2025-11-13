import { api } from '../lib/api';
import { getPlanets, getPlanetById } from './planet';
import { Planet } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedApiGet = api.get as jest.Mock;

describe('Planet Service (app/actions/planet.ts)', () => {
  // Clear mock call history before each test
  beforeEach(() => {
    mockedApiGet.mockClear();
  });

  // === Tests for getPlanets ===
  describe('getPlanets', () => {
    it('should successfully fetch a list of planets', async () => {
      const mockResponse: Paginated<Planet> = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Tatooine' } as Planet],
      };

      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getPlanets(1);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith('/planets/?page=1');
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getPlanets(1)).rejects.toThrow(`Cannot fetch planets: ${errorMessage}`);
    });
  });

  // === Tests for getPlanetById ===
  describe('getPlanetById', () => {
    it('should successfully fetch a planet by ID', async () => {
      const planetId = 1;
      const mockResponse: Planet = { name: 'Tatooine' } as Planet;
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getPlanetById(planetId);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith(`/planets/${planetId}/`);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const planetId = 99;
      const errorMessage = 'Not Found';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getPlanetById(planetId)).rejects.toThrow(
        `Cannot fetch planet ${planetId}: ${errorMessage}`,
      );
    });
  });
});
