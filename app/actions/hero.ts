'use server';

import axios from "axios";
import { api } from "../lib/api";
import { Film, Hero, Starship } from "../types";
import { Paginated } from "../types/paginated";

/**
 * Fetches a paginated list of heroes from the API.
 *
 * @async
 * @function getHeroes
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @returns {Promise<Paginated<Hero>>} A promise that resolves with a paginated list of heroes.
 * @throws {Error} Throws an error if heroes cannot be fetched.
 */
export const getHeroes = async (page = 1): Promise<Paginated<Hero>> => {
  try {
    const { data } = await api.get<Paginated<Hero>>(`/people/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch heroes: ${(error as Error).message}`);
  }
};

/**
 * Fetches a specific hero by their ID from the API.
 *
 * @async
 * @function getHeroById
 * @param {number} id - The ID of the hero to fetch.
 * @returns {Promise<Hero>} A promise that resolves with the hero data.
 * @throws {Error} Throws an error if the hero cannot be fetched.
 */
export const getHeroById = async (id: number): Promise<Hero> => {
  try {
    const { data } = await api.get<Hero>(`/people/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch hero ${id}: ${(error as Error).message}`);
  }
};

/**
 * Represents a film and the starships that appear in it.
 * @typedef {Object} FilmWithStarships
 * @property {Film} film - The film data.
 * @property {Starship[]} starships - The list of starships appearing in the film.
 */
type FilmWithStarships = {
  film: Film;
  starships: Starship[];
};

/**
 * Represents a hero and the films they appear in, including the hero’s starships for each film.
 * @typedef {Object} HeroDetails
 * @property {Hero} hero - The hero data.
 * @property {FilmWithStarships[]} films - The films in which the hero appears, with related starships.
 */
type HeroDetails = {
  hero: Hero;
  films: FilmWithStarships[];
};

/**
 * Fetches detailed information about a hero, including their films and associated starships.
 *
 * For each film the hero appears in:
 * - Fetches the film data.
 * - Determines which starships from that film belong to the hero.
 * - Fetches data for those starships.
 *
 * @async
 * @function getHeroDetails
 * @param {Hero} hero - The hero object to fetch details for.
 * @returns {Promise<HeroDetails>} A promise that resolves with the hero details including films and starships.
 * @throws {Error} Logs an error and returns an empty film list if fetching fails.
 */
export const getHeroDetails = async (hero: Hero): Promise<HeroDetails> => {
  try {
    // Fetch full data for all films where the hero appears
    const filmsData: Film[] = await Promise.all(
      hero.films.map((url) => axios.get<Film>(url).then(res => res.data))
    );

    // For each film, find starships that belong to the hero
    const filmsWithStarships: FilmWithStarships[] = await Promise.all(
      filmsData.map(async (film) => {
        const heroStarshipsInFilm = film.starships.filter(url =>
          hero.starships.includes(url)
        );

        // Fetch full data for each of the hero’s starships in this film
        const starships: Starship[] = await Promise.all(
          heroStarshipsInFilm.map(url => axios.get<Starship>(url).then(res => res.data))
        );

        return { film, starships };
      })
    );

    return { hero, films: filmsWithStarships };
  } catch (err) {
    console.error("Failed to fetch hero details", err);
    return { hero, films: [] };
  }
};
