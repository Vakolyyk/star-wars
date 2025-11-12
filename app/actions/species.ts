'use server';

import { api } from "../lib/api";
import { Species } from "../types";
import { Paginated } from "./paginated";

export const getSpecies = async (page = 1): Promise<Paginated<Species>> => {
  try {
    const { data } = await api.get<Paginated<Species>>(`/species/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch species: ${(error as Error).message}`);
  }
};

export const getSpeciesById = async (id: number): Promise<Species> => {
  try {
    const { data } = await api.get<Species>(`/species/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch species ${id}: ${(error as Error).message}`);
  }
};