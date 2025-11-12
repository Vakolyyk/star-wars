import { api } from "../lib/api";
import { Vehicle } from "../types";

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const { data } = await api.get<Vehicle[]>('/vehicles/');
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch vehicles: ${(error as Error).message}`);
  }
};

export const getVehicleById = async (id: number): Promise<Vehicle> => {
  try {
    const { data } = await api.get<Vehicle>(`/vehicles/${id}/`);
    return data;
  } catch (error) {
    throw new Error(`Cannot fetch vehicle ${id}: ${(error as Error).message}`);
  }
};