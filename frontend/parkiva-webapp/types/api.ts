export interface ParkingDto {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  district: string;
  totalSpaces: number;
  availableSpaces: number;
  freeTime: number;
  parkType: ParkType;
  isReservable: boolean;
  pricePerHour: number;
  openHours: string;
  active: boolean;
  externalId?: number;
  dataSource: ParkingDataSource;
  createdAt: string;
  lastSyncedAt?: string;
}

export enum ParkType {
  StreetParking = 0,
  ParkingGarage = 1,
  ParkingLot = 2,
  PrivateParking = 3
}

export enum ParkingDataSource {
  Manual = 0,
  Ispark = 1,
  External = 2
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface ParkingSearchParams {
  district?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}
