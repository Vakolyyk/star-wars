'use server';

import { api } from "../lib/api";
import { Film } from "../types";
import { Paginated } from "./paginated";

export const getFilms = async (page = 1): Promise<Paginated<Film>> => {
  try {
    const { data } = await api.get<Paginated<Film>>(`/films/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch films: ${(error as Error).message}`);
  }
};

export const getFilmById = async (id: number): Promise<Film> => {
  try {
    const { data } = await api.get<Film>(`/films/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch film ${id}: ${(error as Error).message}`);
  }
};