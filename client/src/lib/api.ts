import type { Vehicle, Booking, User } from '@/types';

const API_BASE: string = (import.meta as { env?: { VITE_API_BASE_URL?: string } })?.env?.VITE_API_BASE_URL || 'http://localhost:5000';

// Validate API_BASE on module load
if (!API_BASE) {
  console.error('VITE_API_BASE_URL is not defined. Using default: http://localhost:5000');
}

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

// ==================== VEHICLES ====================
export type CreateVehicleInput = {
  make: string;
  model: string;
  year: number;
  category: 'sedan' | 'suv' | 'luxury' | 'sports' | 'van';
  image?: string;
  dailyRate: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  status?: 'available' | 'rented' | 'maintenance';
  location?: string;
  rating?: number;
  features?: string[];
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const json = await request<Record<string, unknown>>(`/api/vehicles`, { method: 'POST', body: JSON.stringify(input) });
  return mapVehicle(json);
}

export async function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
  const json = await request<Record<string, unknown>>(`/api/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(input) });
  return mapVehicle(json);
}

export async function deleteVehicle(id: string): Promise<{ ok: boolean; message: string }> {
  return request<{ ok: boolean; message: string }>(`/api/vehicles/${id}`, { method: 'DELETE' });
}

// ==================== BOOKINGS ====================
export type GetBookingsParams = {
  status?: string;
  vehicleId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export async function listBookings(params: GetBookingsParams = {}): Promise<{ data: Booking[]; page: number; limit: number; total: number }> {
  const qs = buildQuery(params as Record<string, string | number | boolean>);
  const json = await request<{ data: Record<string, unknown>[]; page: number; limit: number; total: number }>(`/api/bookings${qs}`);
  return { ...json, data: (json.data || []).map(mapBooking) };
}

export async function getBooking(id: string): Promise<Booking> {
  const json = await request<Record<string, unknown>>(`/api/bookings/${id}`);
  return mapBooking(json);
}

export type UpdateBookingInput = {
  status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pickupDate?: string | Date;
  returnDate?: string | Date;
  location?: string;
};

export async function updateBooking(id: string, input: UpdateBookingInput): Promise<Booking> {
  const payload = {
    ...input,
    pickupDate: input.pickupDate instanceof Date ? input.pickupDate.toISOString() : input.pickupDate,
    returnDate: input.returnDate instanceof Date ? input.returnDate.toISOString() : input.returnDate,
  };
  const json = await request<Record<string, unknown>>(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return mapBooking(json);
}

export async function deleteBooking(id: string): Promise<{ ok: boolean; message: string }> {
  return request<{ ok: boolean; message: string }>(`/api/bookings/${id}`, { method: 'DELETE' });
}

// ==================== USERS ====================
function mapUser(u: Record<string, unknown>): User {
  return {
    id: (u._id as string) || (u.id as string),
    name: u.name as string,
    email: u.email as string,
    role: u.role as User['role'],
    avatar: (u.avatar as string) || '',
    isActive: u.isActive !== undefined ? (u.isActive as boolean) : true,
    _id: u._id as string,
  };
}

export type ListUsersParams = {
  role?: string;
  q?: string;
  page?: number;
  limit?: number;
};

export async function listUsers(params: ListUsersParams = {}): Promise<{ data: User[]; page: number; limit: number; total: number }> {
  const qs = buildQuery(params as Record<string, string | number | boolean>);
  const json = await request<{ data: Record<string, unknown>[]; page: number; limit: number; total: number }>(`/api/users${qs}`);
  return { ...json, data: (json.data || []).map(mapUser) };
}

export async function getUser(id: string): Promise<User> {
  const json = await request<Record<string, unknown>>(`/api/users/${id}`);
  return mapUser(json);
}

export type CreateUserInput = {
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  password?: string;
};

export async function createUser(input: CreateUserInput): Promise<User> {
  const json = await request<Record<string, unknown>>(`/api/users`, { method: 'POST', body: JSON.stringify(input) });
  return mapUser(json);
}

export type UpdateUserInput = {
  name?: string;
  role?: 'admin' | 'staff' | 'customer';
  isActive?: boolean;
  password?: string;
};

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  const json = await request<Record<string, unknown>>(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  return mapUser(json);
}

export async function deleteUser(id: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/api/users/${id}`, { method: 'DELETE' });
}

// ==================== EXPORTED API ====================
export const api = {
  // Vehicles
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  
  // Bookings
  createBooking,
  getMyBookings,
  listBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  
  // Users
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
