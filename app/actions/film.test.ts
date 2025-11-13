import { api } from '../lib/api';
import { getFilms, getFilmById } from './film';
import { Film } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedApiGet = api.get as jest.Mock;

describe('Film Service (app/actions/film.ts)', () => {
  // Clear mock call history before each test
  beforeEach(() => {
    mockedApiGet.mockClear();
  });

  // === Tests for getFilms ===
  describe('getFilms', () => {
    it('should successfully fetch a list of films', async () => {
      const mockResponse: Paginated<Film> = {
        count: 1,
        next: null,
        previous: null,
        results: [{ id: 1, title: 'A New Hope' } as unknown as Film],
      };

      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getFilms(1);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith('/films/?page=1');
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getFilms(1)).rejects.toThrow(`Cannot fetch films: ${errorMessage}`);
    });
  });

  // === Tests for getFilmById ===
  describe('getFilmById', () => {
    it('should successfully fetch a film by ID', async () => {
      const filmId = 5;
      const mockResponse: Film = { id: 5, title: 'The Empire Strikes Back' } as unknown as Film;
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getFilmById(filmId);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith(`/films/${filmId}/`);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const filmId = 99;
      const errorMessage = 'Not Found';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getFilmById(filmId)).rejects.toThrow(
        `Cannot fetch film ${filmId}: ${errorMessage}`,
      );
    });
  });
});
