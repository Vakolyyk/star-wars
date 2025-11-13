'use server';

import { api } from "../lib/api";
import { Vehicle } from "../types";
import { Paginated } from "../types/paginated";

/**
 * Fetches a paginated list of vehicles from the API.
 *
 * @async
 * @function getVehicles
 * @param {number} [page=1] - The page number to fetch (default is 1).
 * @returns {Promise<Paginated<Vehicle>>} A promise that resolves with a paginated list of vehicles.
 * @throws {Error} Throws an error if the vehicles cannot be fetched.
 */
export const getVehicles = async (page = 1): Promise<Paginated<Vehicle>> => {
  try {
    const { data } = await api.get<Paginated<Vehicle>>(`/vehicles/?page=${page}`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch vehicles: ${(error as Error).message}`);
  }
};

/**
 * Fetches a specific vehicle by its ID from the API.
 *
 * @async
 * @function getVehicleById
 * @param {number} id - The ID of the vehicle to fetch.
 * @returns {Promise<Vehicle>} A promise that resolves with the vehicle data.
 * @throws {Error} Throws an error if the vehicle cannot be fetched.
 */
export const getVehicleById = async (id: number): Promise<Vehicle> => {
  try {
    const { data } = await api.get<Vehicle>(`/vehicles/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch vehicle ${id}: ${(error as Error).message}`);
  }
};
