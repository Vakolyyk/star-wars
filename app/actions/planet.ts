'use server';

import { api } from "../lib/api";
import { Planet } from "../types";
import { Paginated } from "../types/paginated";

export const getPlanets = async (page = 1): Promise<Paginated<Planet>> => {
  try {
    const { data } = await api.get<Paginated<Planet>>(`/planets/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch planets: ${(error as Error).message}`);
  }
};

export const getPlanetById = async (id: number): Promise<Planet> => {
  try {
    const { data } = await api.get<Planet>(`/planets/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch planet ${id}: ${(error as Error).message}`);
  }
};