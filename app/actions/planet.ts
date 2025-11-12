import { api } from "../lib/api";
import { Planet } from "../types";

export const getPlanets = async (): Promise<Planet[]> => {
  try {
    const { data } = await api.get<Planet[]>('/planets/');
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