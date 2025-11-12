import { api } from "../lib/api";
import { Hero } from "../types";

export const getHeroes = async (): Promise<Hero[]> => {
  try {
    const { data } = await api.get<Hero[]>('/people/');
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