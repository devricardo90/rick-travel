# Directive: Manage Trips (Create / Edit / Delete)

## Objective
Manage the lifecycle of `Trip` entities in the system. This includes creating new tour packages, updating existing details, and removing outdated packages.

## 1. Create Trip
**Trigger**: Admin submits "New Trip" form.

### Inputs
- `title` (string, required, min 3 chars)
- `description` (string, optional)
- `city` (string, required)
- `location` (string, optional - specific meeting point)
- `priceCents` (integer, required, >= 0)
- `startDate` (datetime, optional)
- `endDate` (datetime, optional)
- `imageUrl` (string, optional - URL from storage)
- `maxGuests` (integer, optional)

### Validation & Rules
1. **User Role**: Must be `ADMIN`.
2. **Dates**: If `endDate` is provided, it must be >= `startDate`.
3. **Price**: Must be stored in cents (e.g., R$ 100,00 = 10000).

### Services
- database (Prisma): `ctx.prisma.trip.create(data)`

---

## 2. Edit Trip
**Trigger**: Admin submits "Edit Trip" form.

### Inputs
- `id` (string, required)
- *...Same inputs as Create Trip*

### Validation & Rules
1. **User Role**: Must be `ADMIN`.
2. **Existence**: Verify trip exists before update.
3. **Optimistic Locking**: (Optional) Check if trip was modified by another admin.

### Services
- database (Prisma): `ctx.prisma.trip.update({ where: { id }, data })`

---

## 3. Delete Trip
**Trigger**: Admin clicks "Delete" button.

### Validation & Rules
1. **User Role**: Must be `ADMIN`.
2. **Bookings Check**: 
   - **CRITICAL**: Check if there are active `bookings` (status: CONFIRMED or PENDING) linked to this trip.
   - If active bookings exist, **PREVENT DELETION** or require "Soft Delete" (marking as inactive). 
   - *Current Implementation*: Checks for bookings. If 0 bookings, allow hard delete.

### Services
- database (Prisma): `ctx.prisma.trip.delete({ where: { id } })`

---

## Edge Cases
- **Image Upload Fail**: If image upload fails, do not create the trip record.
- **Network Error**: Show toast notification "Failed to save trip".
