import { api } from '../lib/api';
import { getSpecies, getSpeciesById } from './species';
import { Species } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedApiGet = api.get as jest.Mock;

describe('Species Service (app/actions/species.ts)', () => {
  // Clear mock call history before each test
  beforeEach(() => {
    mockedApiGet.mockClear();
  });

  // === Tests for getSpecies ===
  describe('getSpecies', () => {
    it('should successfully fetch a list of species', async () => {
      const mockResponse: Paginated<Species> = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Human' } as Species],
      };

      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getSpecies(1);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith('/species/?page=1');
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getSpecies(1)).rejects.toThrow(`Cannot fetch species: ${errorMessage}`);
    });
  });

  // === Tests for getSpeciesById ===
  describe('getSpeciesById', () => {
    it('should successfully fetch a species by ID', async () => {
      const speciesId = 1;
      const mockResponse: Species = { name: 'Human' } as Species;
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getSpeciesById(speciesId);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith(`/species/${speciesId}/`);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const speciesId = 99;
      const errorMessage = 'Not Found';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getSpeciesById(speciesId)).rejects.toThrow(
        `Cannot fetch species ${speciesId}: ${errorMessage}`,
      );
    });
  });
});
