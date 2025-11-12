import { api } from "../lib/api";
import { Film } from "../types";

export const getFilms = async (): Promise<Film[]> => {
  try {
    const { data } = await api.get<Film[]>('/films/');
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