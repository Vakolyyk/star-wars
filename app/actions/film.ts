'use server';

import { api } from "../lib/api";
import { Film } from "../types";
import { Paginated } from "../types/paginated";

/**
 * Fetches a paginated list of films from the API.
 *
 * @async
 * @function getFilms
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @returns {Promise<Paginated<Film>>} A promise that resolves with a paginated list of films.
 * @throws {Error} Throws an error if the films cannot be fetched.
 */
export const getFilms = async (page = 1): Promise<Paginated<Film>> => {
  try {
    const { data } = await api.get<Paginated<Film>>(`/films/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch films: ${(error as Error).message}`);
  }
};

/**
 * Fetches a specific film by its ID from the API.
 *
 * @async
 * @function getFilmById
 * @param {number} id - The ID of the film to fetch.
 * @returns {Promise<Film>} A promise that resolves with the film data.
 * @throws {Error} Throws an error if the film cannot be fetched.
 */
export const getFilmById = async (id: number): Promise<Film> => {
  try {
    const { data } = await api.get<Film>(`/films/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch film ${id}: ${(error as Error).message}`);
  }
};
