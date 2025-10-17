# Car Rental API Contract (Inferred from Client UI)

This document analyzes the client application to identify the server-side functionality and data models required. It serves as a guide to implement or align the backend.

Scope: Vehicles, Bookings, Authentication (basic), and role-based use cases (admin, staff, customer).

## Entities and Models

### User
- id: string
- name: string
- email: string
- role: 'admin' | 'staff' | 'customer'
- avatar?: string

Notes:
- Client currently uses a mock login with roles; real backend should issue a session/JWT.

### Vehicle
- id: string
- make: string
- model: string
- year: number
- category: 'sedan' | 'suv' | 'luxury' | 'sports' | 'van'
- image: string (URL)
- dailyRate: number
- transmission: 'automatic' | 'manual'
- fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
- seats: number
- status: 'available' | 'rented' | 'maintenance'
- location: string (e.g., 'Downtown Office', 'Airport Terminal', 'North Branch')
- rating: number (0–5, used for display/sort)
- features: string[]

### Booking
- id: string
- vehicleId: string (ref Vehicle)
- customerId: string (ref User)
- pickupDate: Date/ISO string
- returnDate: Date/ISO string
- status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
- totalPrice: number
- location: string (pickup location)

Status lifecycle (typical):
- pending → confirmed → active → completed
- Any non-completed may go to cancelled.

## Client Operations → Server Requirements

### Customer
- Browse vehicles with filters and sort.
- View availability status, rating, features.
- Start a booking (select dates/location → create booking).
- View active/upcoming bookings.

### Staff
- Dashboard shows counts, recent bookings (same data needed as admin-lite).
- Likely needs to manage bookings (confirm, activate, complete, cancel).
- View and manage vehicles (status updates: available/rented/maintenance).

### Admin
- Overview stats: total vehicles, active bookings, revenue, total customers (statistics endpoints helpful but can be computed client-side from lists initially).
- Manage fleet: CRUD vehicles.
- Manage users (placeholder in UI; optional for now).
- View reports (future).

## REST Endpoints

Base URL suggestion: /api

### Auth
- POST /api/auth/login
  - body: { email: string, password: string }
  - resp: { token: string, user: User }
- GET /api/auth/me
  - headers: Authorization: Bearer <token>
  - resp: { user: User }
- POST /api/auth/logout (optional if using server sessions)

Note: Client currently mocks auth; wire later. For now, server may return a static token and mock user per role for development.

### Vehicles
- GET /api/vehicles
  - Query params (filters):
    - category: string
    - transmission: 'automatic' | 'manual'
    - fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    - seatsMin: number
    - seatsMax: number
    - status: 'available' | 'rented' | 'maintenance'
    - location: string
    - minRate: number
    - maxRate: number
    - search: string (match make/model)
    - sortBy: 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'year_desc' | 'year_asc'
    - page: number (default 1)
    - limit: number (default 20)
  - Response: { data: Vehicle[], page, limit, total }

- GET /api/vehicles/:id
  - Response: Vehicle

- POST /api/vehicles (admin/staff)
  - body: Vehicle (without id) — server assigns id
  - Response: Vehicle

- PATCH /api/vehicles/:id (admin/staff)
  - body: Partial<Vehicle>
  - Response: Vehicle

- DELETE /api/vehicles/:id (admin)
  - Response: { success: true }

- PATCH /api/vehicles/:id/status (staff/admin)
  - body: { status: 'available' | 'rented' | 'maintenance' }
  - Response: Vehicle

### Bookings
- GET /api/bookings (admin/staff)
  - Query: status, vehicleId, customerId, dateFrom, dateTo, page, limit
  - Response: { data: Booking[], page, limit, total }

- GET /api/bookings/my (customer)
  - Auth required; returns bookings for current user
  - Query: status, page, limit
  - Response: { data: Booking[], page, limit, total }

- GET /api/bookings/:id
  - Response: Booking

- POST /api/bookings
  - body: {
      vehicleId: string,
      pickupDate: ISO string,
      returnDate: ISO string,
      location: string
    }
  - Server computes totalPrice = days * vehicle.dailyRate
  - Initial status: 'pending' or 'confirmed' (depending on business rules)
  - Response: Booking

- PATCH /api/bookings/:id
  - body: Partial<Booking> (allowed: status, returnDate, pickupDate, location)
  - Response: Booking

- POST /api/bookings/:id/cancel
  - Response: Booking (status: 'cancelled')

- POST /api/bookings/:id/confirm (staff)
  - Response: Booking (status: 'confirmed')

- POST /api/bookings/:id/activate (staff)
  - Response: Booking (status: 'active')

- POST /api/bookings/:id/complete (staff)
  - Response: Booking (status: 'completed')

### Statistics (optional, for dashboards)
- GET /api/stats/overview (admin)
  - Response: {
      totalVehicles: number,
      activeBookings: number,
      monthlyRevenue: number,
      totalCustomers: number
    }
- GET /api/stats/recent-bookings
  - Response: Booking[] (last N)

## Validation Rules (summary)
- Vehicle.year: reasonable range (e.g., 1990–currentYear+1)
- Vehicle.dailyRate: > 0
- Booking dates: pickupDate < returnDate; no overlap for same vehicle when status in ['confirmed','active']
- Booking totalPrice: ceil((return - pickup)/day) * vehicle.dailyRate

## Error Format
- Use a consistent JSON error envelope:
```json
{ "error": { "message": "string", "code": "string", "details": any } }
```
- Use HTTP codes: 400, 401, 403, 404, 409 (conflict for overlap), 422 (validation), 500.

## Server Implementation Notes (Mongoose)

Suggested Mongoose schemas:

VehicleSchema
- make: String (required)
- model: String (required)
- year: Number (required)
- category: String enum
- image: String
- dailyRate: Number (required)
- transmission: String enum
- fuelType: String enum
- seats: Number
- status: String enum (default: 'available')
- location: String
- rating: Number (default 0)
- features: [String]
- timestamps: true

BookingSchema
- vehicle: ObjectId ref 'Vehicle' (required)
- customerId: String (or ObjectId ref 'User' if user collection exists)
- pickupDate: Date (required)
- returnDate: Date (required)
- status: String enum (default: 'pending')
- totalPrice: Number (required)
- location: String
- timestamps: true
- Index: { vehicle, pickupDate, returnDate }

Consider a pre-save validation for overlap.

## Mapping UI to API (quick checklist)
- Browse Vehicles page uses: category filter, transmission, fuelType, rating/seats display, sort. Provide GET /api/vehicles with filters + sort.
- Customer Dashboard uses: list my active and upcoming bookings; needs GET /api/bookings/my with status filters.
- Admin Dashboard uses: counts and recent bookings; provide stats endpoints or compute client-side from lists; recent bookings endpoint helps.
- Admin/Staff Vehicles pages: need CRUD and status updates for vehicles.

## Authentication and Roles
- Short-term: implement role claim in JWT payload and enforce route guards.
- Long-term: real users collection with hashed passwords.

Example JWT payload:
```json
{ "sub": "<userId>", "email": "user@example.com", "role": "admin" }
```

## Pagination & Sorting
- Standard page/limit with defaults; return total.
- Sorting values mapping:
  - popular → default (could sort by rating desc)
  - rating → rating desc
  - price_asc → dailyRate asc
  - price_desc → dailyRate desc
  - year_desc → year desc
  - year_asc → year asc

## Next Steps
1. Implement Mongoose models aligned with the above schemas.
2. Create Express routers for /api/vehicles and /api/bookings.
3. Implement GET /api/vehicles with filters, sort, pagination first to unblock Browse.
4. Implement POST /api/bookings and GET /api/bookings/my to unblock booking flow.
5. Add status transition endpoints for staff.
6. Optional: basic auth endpoints returning mock users per role until full auth is ready.



## Auth and RBAC (updated)
- Real JWT-based authentication implemented on server.
- Env: JWT_SECRET, JWT_EXPIRES_IN; token includes sub and role.
- Middlewares: authRequired (JWT verify), requireRoles('admin'|'staff'|'customer').
- Protected endpoints:
  - POST /api/vehicles — admin, staff
  - GET /api/bookings — admin, staff
  - GET /api/bookings/my — authenticated user
  - POST /api/bookings — authenticated user; uses req.user.id as customerId
  - /api/users CRUD — admin only
- Client now uses /api/auth/login, /api/auth/register, /api/auth/me and stores JWT.
- Admin-only Users page added at /admin/users.
