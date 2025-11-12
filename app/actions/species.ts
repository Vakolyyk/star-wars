import { api } from "../lib/api";
import { Species } from "../types";

export const getSpecies = async (): Promise<Species[]> => {
  try {
    const { data } = await api.get<Species[]>('/species/');
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