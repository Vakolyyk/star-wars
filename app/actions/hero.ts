'use server';

import axios from "axios";
import { api } from "../lib/api";
import { Film, Hero, Starship } from "../types";
import { Paginated } from "../types/paginated";

export const getHeroes = async (page = 1): Promise<Paginated<Hero>> => {
  try {
    const { data } = await api.get<Paginated<Hero>>(`/people/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch heroes: ${(error as Error).message}`);
  }
};

export const getHeroById = async (id: number): Promise<Hero> => {
  try {
    const { data } = await api.get<Hero>(`/people/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch hero ${id}: ${(error as Error).message}`);
  }
};

type FilmWithStarships = {
  film: Film;
  starships: Starship[];
};

type HeroDetails = {
  hero: Hero;
  films: FilmWithStarships[];
};

export const getHeroDetails = async (hero: Hero): Promise<HeroDetails> => {
  try {
    const filmsData: Film[] = await Promise.all(
      hero.films.map((url) => axios.get<Film>(url).then(res => res.data))
    );

    const filmsWithStarships: FilmWithStarships[] = await Promise.all(
      filmsData.map(async (film) => {
        const heroStarshipsInFilm = film.starships.filter(url =>
          hero.starships.includes(url)
        );

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