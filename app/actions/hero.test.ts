import axios from 'axios';
import { api } from '../lib/api';
import {
  getHeroes,
  getHeroById,
  getHeroDetails,
} from '../actions/hero';
import { Film, Hero, Starship } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

const mockedApiGet = api.get as jest.Mock;
const mockedAxiosGet = axios.get as jest.Mock;

describe('Hero Service (app/actions/hero.ts)', () => {
  // Clear mock history before each test
  beforeEach(() => {
    mockedApiGet.mockClear();
    mockedAxiosGet.mockClear();
  });

  // === Tests for getHeroes ===
  describe('getHeroes', () => {
    it('should successfully fetch a list of heroes', async () => {
      const mockResponse: Paginated<Hero> = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Luke Skywalker' } as Hero],
      };
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getHeroes(1);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith('/people/?page=1');
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getHeroes(1)).rejects.toThrow(
        `Cannot fetch heroes: ${errorMessage}`,
      );
    });
  });

  // === Tests for getHeroById ===
  describe('getHeroById', () => {
    it('should successfully fetch a hero by ID', async () => {
      const heroId = 1;
      const mockResponse: Hero = { name: 'Luke Skywalker' } as Hero;
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getHeroById(heroId);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith(`/people/${heroId}/`);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const heroId = 99;
      const errorMessage = 'Not Found';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getHeroById(heroId)).rejects.toThrow(
        `Cannot fetch hero ${heroId}: ${errorMessage}`,
      );
    });
  });

  // === Tests for getHeroDetails (the complex one) ===
  describe('getHeroDetails', () => {
    let consoleErrorSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should fetch details, filter films, and filter starships', async () => {
      const mockStarship: Starship = {
        name: 'X-Wing',
        url: 'https://swapi.dev/api/starships/12/',
      } as Starship;
      
      const otherStarshipUrl = 'https://swapi.dev/api/starships/13/';

      const mockFilm: Film = {
        title: 'A New Hope',
        url: 'https://swapi.dev/api/films/1/',
        starships: [mockStarship.url, otherStarshipUrl],
      } as Film;

      const mockHero: Hero = {
        name: 'Luke Skywalker',
        films: [mockFilm.url],
        starships: [mockStarship.url],
      } as Hero;

      mockedAxiosGet.mockResolvedValueOnce({ data: mockFilm });
      mockedAxiosGet.mockResolvedValueOnce({ data: mockStarship });

      const result = await getHeroDetails(mockHero);

      expect(result.hero).toEqual(mockHero);
      expect(result.films).toHaveLength(1);
      expect(result.films[0].film).toEqual(mockFilm);
      expect(result.films[0].starships).toHaveLength(1);
      expect(result.films[0].starships[0]).toEqual(mockStarship);

      expect(mockedAxiosGet).toHaveBeenCalledTimes(2);
      expect(mockedAxiosGet).toHaveBeenCalledWith(mockFilm.url);
      expect(mockedAxiosGet).toHaveBeenCalledWith(mockStarship.url);
      expect(mockedAxiosGet).not.toHaveBeenCalledWith(otherStarshipUrl);
    });

    it('should return empty films array on error', async () => {
      const mockHero: Hero = {
        name: 'Luke Skywalker',
        films: ['https://swapi.dev/api/films/1/'],
        starships: [],
      } as unknown as Hero;
      
      const errorMessage = 'Axios failed';
      mockedAxiosGet.mockRejectedValue(new Error(errorMessage));

      const result = await getHeroDetails(mockHero);

      expect(result.hero).toEqual(mockHero);
      expect(result.films).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});