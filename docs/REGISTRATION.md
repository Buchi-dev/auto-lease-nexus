# User Registration Feature

## Overview
The Car Rental application now includes a complete user registration system that allows new users to create accounts and start using the platform.

## Features

### Frontend (Client)
- **Registration Page** (`/register`)
  - Clean, modern UI with form validation
  - Real-time error feedback
  - Password strength requirements display
  - Responsive design
  - Links to login page

### Form Fields
1. **Full Name**
   - Required
   - Minimum 2 characters
   - Maximum 100 characters

2. **Email Address**
   - Required
   - Must be a valid email format
   - Unique (checked server-side)
   - Automatically converted to lowercase

3. **Password**
   - Required
   - Minimum 6 characters
   - Must contain:
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number

4. **Confirm Password**
   - Required
   - Must match password field

### Validation
- **Client-side validation**: Immediate feedback as users type
- **Server-side validation**: Additional security layer
- **Error handling**: Clear, user-friendly error messages

### Backend (Server)

#### API Endpoint
```
POST /api/auth/register
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "customer" // optional, defaults to "customer"
}
```

#### Response (Success - 201)
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "avatar": "",
    "isActive": true,
    "createdAt": "2025-10-17T...",
    "updatedAt": "2025-10-17T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**400 Bad Request** - Validation Error
```json
{
  "error": {
    "message": "Password must contain uppercase, lowercase, and number",
    "code": "BAD_REQUEST"
  }
}
```

**409 Conflict** - Email Already Exists
```json
{
  "error": {
    "message": "Email already in use",
    "code": "CONFLICT"
  }
}
```

**422 Unprocessable Entity** - Mongoose Validation Error
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": {
        "message": "Please provide a valid email address"
      }
    }
  }
}
```

## Security Features

### Password Security
- Passwords are hashed using **bcrypt** with 10 salt rounds
- Plain text passwords are never stored
- Password hashes are excluded from API responses

### Token Management
- JWT tokens are generated upon successful registration
- Tokens include user ID and role
- Default expiration: 7 days
- Tokens are stored securely in client-side storage

### Input Sanitization
- Email addresses are trimmed and converted to lowercase
- Names are trimmed of whitespace
- Special characters are handled safely

## User Flow

1. User navigates to `/register`
2. User fills out the registration form
3. Client validates input in real-time
4. On submit, client sends data to server
5. Server validates data and checks for duplicate email
6. Server hashes password and creates user record
7. Server generates JWT token
8. Client receives token and user data
9. Client stores authentication state
10. User is redirected to dashboard

## Navigation

### From Login Page
- "Sign up now" link at the bottom of the login form
- Navigates to `/register`

### From Registration Page
- "Sign in" link for existing users
- "Back to Login" button
- Both navigate to `/login`

## File Structure

### Client Files
```
client/src/
├── pages/
│   ├── Register.tsx          # Registration page component
│   └── Login.tsx             # Updated with registration link
├── store/
│   └── authStore.ts          # Updated with register method
└── App.tsx                   # Updated with /register route
```

### Server Files
```
server/src/
├── controllers/
│   └── auth.controller.js    # Enhanced with validation
├── models/
│   └── user.model.js         # Enhanced with validators
└── routes/
    └── auth.route.js         # Registration route already exists
```

## Usage Examples

### Register a New Customer
```typescript
import { useAuthStore } from '@/store/authStore';

const { register } = useAuthStore();

await register(
  'Jane Smith',
  'jane@example.com',
  'SecurePass123'
);
```

### Register with Specific Role (Admin/Staff)
```typescript
await register(
  'Admin User',
  'admin@example.com',
  'AdminPass123',
  'admin'
);
```

## Testing

### Manual Testing Checklist
- [ ] Form displays correctly on all screen sizes
- [ ] Validation errors show for invalid inputs
- [ ] Duplicate email shows appropriate error
- [ ] Successful registration redirects to dashboard
- [ ] User can navigate between login and register pages
- [ ] Password requirements are clear
- [ ] Loading states are shown during submission

### Test Cases

1. **Valid Registration**
   - Input: Valid name, email, and password
   - Expected: Success, redirect to dashboard

2. **Duplicate Email**
   - Input: Email that already exists
   - Expected: Error message about duplicate email

3. **Weak Password**
   - Input: Password without required characters
   - Expected: Validation error

4. **Password Mismatch**
   - Input: Different password and confirm password
   - Expected: Validation error

5. **Invalid Email**
   - Input: Malformed email address
   - Expected: Validation error

## Future Enhancements

- [ ] Email verification system
- [ ] OAuth/Social login integration
- [ ] Password strength indicator
- [ ] CAPTCHA for bot protection
- [ ] Two-factor authentication
- [ ] Profile picture upload during registration
- [ ] Terms and conditions checkbox
- [ ] Newsletter subscription option
- [ ] Phone number verification

## Troubleshooting

### Common Issues

**Issue**: "Email already in use" error
- **Solution**: Use a different email or try logging in

**Issue**: Token not persisting
- **Solution**: Check browser storage settings, clear cache

**Issue**: Validation errors not showing
- **Solution**: Check browser console for JavaScript errors

**Issue**: Server returns 500 error
- **Solution**: Check server logs, ensure MongoDB is running

## Dependencies

### Frontend
- React Router DOM (navigation)
- Zustand (state management)
- Framer Motion (animations)
- Sonner (toast notifications)
- Shadcn UI components

### Backend
- Express.js (routing)
- Mongoose (database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT tokens)

## Environment Variables

### Server
```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/car_rental
```

### Client
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Additional Resources

- [API Contract Documentation](./api-contract.md)
- [Authentication Flow](./auth-flow.md)
- [User Model Schema](../server/src/models/user.model.js)
- [Registration Controller](../server/src/controllers/auth.controller.js)
