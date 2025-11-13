'use server';

import { api } from '../lib/api';
import { Species } from '../types';
import { Paginated } from '../types/paginated';

/**
 * Fetches a paginated list of species from the API.
 *
 * @async
 * @function getSpecies
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @returns {Promise<Paginated<Species>>} A promise that resolves with a paginated list of species.
 * @throws {Error} Throws an error if the species cannot be fetched.
 */
export const getSpecies = async (page = 1): Promise<Paginated<Species>> => {
  try {
    const { data } = await api.get<Paginated<Species>>(`/species/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch species: ${(error as Error).message}`);
  }
};

/**
 * Fetches a specific species by its ID from the API.
 *
 * @async
 * @function getSpeciesById
 * @param {number} id - The ID of the species to fetch.
 * @returns {Promise<Species>} A promise that resolves with the species data.
 * @throws {Error} Throws an error if the species cannot be fetched.
 */
export const getSpeciesById = async (id: number): Promise<Species> => {
  try {
    const { data } = await api.get<Species>(`/species/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch species ${id}: ${(error as Error).message}`);
  }
};
