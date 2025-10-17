# Registration API Test Script

## Using cURL

### 1. Register a New User (Customer)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 2. Register a New User with Role
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "AdminPass123",
    "role": "admin"
  }'
```

### 3. Test Duplicate Email (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another John",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 4. Test Weak Password (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "weak"
  }'
```

### 5. Test Invalid Email (Should Fail)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "SecurePass123"
  }'
```

### 6. Login with New User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

## Using PowerShell (Windows)

### 1. Register a New User
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 2. Register with Role
```powershell
$body = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "AdminPass123"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 3. Test Login
```powershell
$body = @{
    email = "john@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Using JavaScript/Fetch

### 1. Register Function
```javascript
async function register(name, email, password, role = 'customer') {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const data = await response.json();
    console.log('Registration successful:', data);
    return data;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
}

// Usage
register('John Doe', 'john@example.com', 'SecurePass123')
  .then(data => console.log('User registered:', data.user))
  .catch(error => console.error('Error:', error));
```

## Expected Responses

### Success Response (201)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "avatar": "",
    "isActive": true,
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2OTc1NTEyMDAsImV4cCI6MTY5ODE1NjAwMH0.xyz123..."
}
```

### Error Response - Validation Error (400)
```json
{
  "error": {
    "message": "Password must contain uppercase, lowercase, and number",
    "code": "BAD_REQUEST"
  }
}
```

### Error Response - Duplicate Email (409)
```json
{
  "error": {
    "message": "Email already in use",
    "code": "CONFLICT"
  }
}
```

### Error Response - Missing Fields (400)
```json
{
  "error": {
    "message": "name, email, password are required",
    "code": "BAD_REQUEST"
  }
}
```

## Validation Rules Summary

| Field | Required | Min Length | Max Length | Format | Other Rules |
|-------|----------|------------|------------|---------|-------------|
| name | Yes | 2 | 100 | Text | Trimmed |
| email | Yes | - | - | Email | Valid format, unique, lowercase |
| password | Yes | 6 | - | Text | Must have uppercase, lowercase, number |
| role | No | - | - | Enum | 'admin', 'staff', or 'customer' (default) |

## Testing Checklist

- [ ] Successful registration with valid data
- [ ] Duplicate email returns 409 error
- [ ] Missing required fields return 400 error
- [ ] Short password (< 6 chars) returns 400 error
- [ ] Password without uppercase returns 400 error
- [ ] Password without lowercase returns 400 error
- [ ] Password without number returns 400 error
- [ ] Invalid email format returns 400 error
- [ ] Short name (< 2 chars) returns 400 error
- [ ] Invalid role returns 400 error
- [ ] Role defaults to 'customer' when not provided
- [ ] Email is stored in lowercase
- [ ] Name is trimmed of whitespace
- [ ] Password is properly hashed (not stored as plain text)
- [ ] Token is returned and valid
- [ ] User can login with new credentials

## Notes

- Make sure MongoDB is running before testing
- Make sure the server is running on port 5000 (or update URLs accordingly)
- JWT_SECRET must be set in server environment variables
- Tokens expire in 7 days by default
