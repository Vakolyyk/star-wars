'use server';

import { api } from '../lib/api';
import { Starship } from '../types';
import { Paginated } from '../types/paginated';

/**
 * Fetches a paginated list of starships from the API.
 *
 * @async
 * @function getStarships
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @returns {Promise<Paginated<Starship>>} A promise that resolves with a paginated list of starships.
 * @throws {Error} Throws an error if the starships cannot be fetched.
 */
export const getStarships = async (page = 1): Promise<Paginated<Starship>> => {
  try {
    const { data } = await api.get<Paginated<Starship>>(`/starships/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch starships: ${(error as Error).message}`);
  }
};

/**
 * Fetches a specific starship by its ID from the API.
 *
 * @async
 * @function getStarshipById
 * @param {number} id - The ID of the starship to fetch.
 * @returns {Promise<Starship>} A promise that resolves with the starship data.
 * @throws {Error} Throws an error if the starship cannot be fetched.
 */
export const getStarshipById = async (id: number): Promise<Starship> => {
  try {
    const { data } = await api.get<Starship>(`/starships/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch starship ${id}: ${(error as Error).message}`);
  }
};
