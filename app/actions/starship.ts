import { api } from "../lib/api";
import { Starship } from "../types";

export const getStarships = async (): Promise<Starship[]> => {
  try {
    const { data } = await api.get<Starship[]>('/starships/');
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