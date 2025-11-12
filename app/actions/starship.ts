'use server';

import { api } from "../lib/api";
import { Starship } from "../types";
import { Paginated } from "../types/paginated";

export const getStarships = async (page = 1): Promise<Paginated<Starship>> => {
  try {
    const { data } = await api.get<Paginated<Starship>>(`/starships/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch starships: ${(error as Error).message}`);
  }
};

export const getStarshipById = async (id: number): Promise<Starship> => {
  try {
    const { data } = await api.get<Starship>(`/starships/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch starship ${id}: ${(error as Error).message}`);
  }
};