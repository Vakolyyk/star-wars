import { api } from '../lib/api';
import { getVehicles, getVehicleById } from './vehicle';
import { Vehicle } from '../types';
import { Paginated } from '../types/paginated';

jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedApiGet = api.get as jest.Mock;

describe('Vehicle Service (app/actions/vehicle.ts)', () => {
  // Clear mock call history before each test
  beforeEach(() => {
    mockedApiGet.mockClear();
  });

  // === Tests for getVehicles ===
  describe('getVehicles', () => {
    it('should successfully fetch a list of vehicles', async () => {
      const mockResponse: Paginated<Vehicle> = {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Sand Crawler' } as Vehicle],
      };

      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getVehicles(1);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith('/vehicles/?page=1');
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getVehicles(1)).rejects.toThrow(`Cannot fetch vehicles: ${errorMessage}`);
    });
  });

  // === Tests for getVehicleById ===
  describe('getVehicleById', () => {
    it('should successfully fetch a vehicle by ID', async () => {
      const vehicleId = 4;
      const mockResponse: Vehicle = { name: 'Sand Crawler' } as Vehicle;
      mockedApiGet.mockResolvedValue({ data: mockResponse });

      const result = await getVehicleById(vehicleId);

      expect(result).toEqual(mockResponse);
      expect(mockedApiGet).toHaveBeenCalledWith(`/vehicles/${vehicleId}/`);
      expect(mockedApiGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the request fails', async () => {
      const vehicleId = 99;
      const errorMessage = 'Not Found';
      mockedApiGet.mockRejectedValue(new Error(errorMessage));

      await expect(getVehicleById(vehicleId)).rejects.toThrow(
        `Cannot fetch vehicle ${vehicleId}: ${errorMessage}`,
      );
    });
  });
});
