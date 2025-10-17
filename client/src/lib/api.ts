import type { Vehicle, Booking } from '@/types';

const API_BASE: string = (import.meta as { env?: { VITE_API_BASE_URL?: string } })?.env?.VITE_API_BASE_URL;

function buildQuery(params: Record<string, string | number | boolean> = {}): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.append(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const state = parsed?.state || parsed; // zustand persist stores under { state }
    const token = state?.token || state?.state?.token; // be safe for nested shapes
    return token || null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> || {}),
  };
  if (token && !('Authorization' in headers)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...init,
  });
  if (!res.ok) {
    let err: { error?: { message?: string } } | undefined = undefined;
    try { 
      err = await res.json(); 
    } catch {
      // Ignore parsing errors
    }
    const message = err?.error?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return res.json();
}

function mapVehicle(v: Record<string, unknown>): Vehicle {
  return {
    id: v._id || v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    category: v.category,
    image: v.image || '',
    dailyRate: v.dailyRate,
    transmission: v.transmission,
    fuelType: v.fuelType,
    seats: v.seats,
    status: v.status,
    location: v.location || '',
    rating: v.rating ?? 0,
    features: Array.isArray(v.features) ? v.features : [],
  } as Vehicle;
}

export type ListVehiclesParams = {
  page?: number;
  limit?: number;
  category?: string;
  transmission?: string;
  fuelType?: string;
  status?: string;
  location?: string;
  seatsMin?: number;
  seatsMax?: number;
  minRate?: number;
  maxRate?: number;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'year_desc' | 'year_asc';
};

export async function listVehicles(params: ListVehiclesParams = {}): Promise<{ data: Vehicle[]; page: number; limit: number; total: number }> {
  const qs = buildQuery(params as Record<string, string | number | boolean>);
  const json = await request<{ data: Record<string, unknown>[]; page: number; limit: number; total: number }>(`/api/vehicles${qs}`);
  return { ...json, data: (json.data || []).map(mapVehicle) };
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const json = await request<Record<string, unknown>>(`/api/vehicles/${id}`);
  return mapVehicle(json);
}

export type CreateBookingInput = {
  vehicleId: string;
  customerId: string;
  pickupDate: string | Date;
  returnDate: string | Date;
  location?: string;
};

function mapBooking(b: Record<string, unknown>): Booking {
  const vehicle = b.vehicle as Record<string, unknown> | undefined;
  return {
    id: (b._id as string) || (b.id as string),
    vehicleId: vehicle?._id as string || (b.vehicleId as string),
    customerId: b.customerId as string,
    pickupDate: new Date(b.pickupDate as string),
    returnDate: new Date(b.returnDate as string),
    status: b.status as Booking['status'],
    totalPrice: b.totalPrice as number,
    location: (b.location as string) || '',
  } as Booking;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const payload = {
    ...input,
    pickupDate: input.pickupDate instanceof Date ? input.pickupDate.toISOString() : input.pickupDate,
    returnDate: input.returnDate instanceof Date ? input.returnDate.toISOString() : input.returnDate,
  };
  const json = await request<Record<string, unknown>>(`/api/bookings`, { method: 'POST', body: JSON.stringify(payload) });
  return mapBooking(json);
}

export type GetMyBookingsParams = { customerId?: string; status?: string; page?: number; limit?: number };
export async function getMyBookings(params: GetMyBookingsParams = {}): Promise<{ data: Booking[]; page: number; limit: number; total: number }> {
  const qs = buildQuery(params as Record<string, string | number | boolean>);
  const json = await request<{ data: Record<string, unknown>[]; page: number; limit: number; total: number }>(`/api/bookings/my${qs}`);
  return { ...json, data: (json.data || []).map(mapBooking) };
}

export const api = {
  listVehicles,
  getVehicle,
  createBooking,
  getMyBookings,
};
