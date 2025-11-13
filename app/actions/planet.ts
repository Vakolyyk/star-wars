'use server';

import { api } from '../lib/api';
import { Planet } from '../types';
import { Paginated } from '../types/paginated';

/**
 * Fetches a paginated list of planets from the API.
 *
 * @async
 * @function getPlanets
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @returns {Promise<Paginated<Planet>>} A promise that resolves with a paginated list of planets.
 * @throws {Error} Throws an error if the planets cannot be fetched.
 */
export const getPlanets = async (page = 1): Promise<Paginated<Planet>> => {
  try {
    const { data } = await api.get<Paginated<Planet>>(`/planets/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch planets: ${(error as Error).message}`);
  }
};

/**
 * Fetches a specific planet by its ID from the API.
 *
 * @async
 * @function getPlanetById
 * @param {number} id - The ID of the planet to fetch.
 * @returns {Promise<Planet>} A promise that resolves with the planet data.
 * @throws {Error} Throws an error if the planet cannot be fetched.
 */
export const getPlanetById = async (id: number): Promise<Planet> => {
  try {
    const { data } = await api.get<Planet>(`/planets/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch planet ${id}: ${(error as Error).message}`);
  }
};
