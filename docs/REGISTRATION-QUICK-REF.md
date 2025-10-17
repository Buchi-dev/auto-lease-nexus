# Registration Quick Reference

## 🚀 Quick Start

### Access the Registration Page
```
URL: http://localhost:5173/register
```

### Test Registration (UI)
1. Navigate to `http://localhost:5173/register`
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: SecurePass123
   - Confirm: SecurePass123
3. Click "Create Account"

### Test Registration (API)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

## 📝 Validation Rules (Quick)

| Field | Min | Max | Pattern | Required |
|-------|-----|-----|---------|----------|
| Name | 2 | 100 | Text | ✅ |
| Email | - | - | Valid email | ✅ |
| Password | 6 | - | Upper+Lower+Number | ✅ |

## 🔑 Password Rules
```
✓ Minimum 6 characters
✓ At least 1 uppercase (A-Z)
✓ At least 1 lowercase (a-z)
✓ At least 1 number (0-9)

Examples:
✅ Password123
✅ SecurePass1
❌ password (no uppercase, no number)
❌ PASSWORD123 (no lowercase)
```

## 🎯 API Endpoint

```typescript
POST /api/auth/register

Request:
{
  name: string,      // required, 2-100 chars
  email: string,     // required, valid format, unique
  password: string,  // required, 6+ chars, strength rules
  role?: string      // optional, defaults to 'customer'
}

Response (201):
{
  user: User,
  token: string
}

Errors:
400 - Validation error
409 - Email already exists
```

## 💻 Code Examples

### Register a User (Frontend)
```typescript
import { useAuthStore } from '@/store/authStore';

const { register } = useAuthStore();

// Customer (default)
await register('John Doe', 'john@example.com', 'Pass123');

// Admin
await register('Admin', 'admin@example.com', 'Admin123', 'admin');
```

### Register a User (Backend API Call)
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const { user, token } = await response.json();
```

## 🔒 Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Email addresses stored in lowercase
- Input is trimmed automatically
- CSRF protection via SameSite cookies
- XSS prevention via React

## 🐛 Debugging

### Check Client Errors
```javascript
// Browser Console
localStorage.getItem('auth-storage') // Check stored auth
```

### Check Server Errors
```bash
# Server logs
tail -f server/logs/app.log
```

### Common Issues

**"Email already in use"**
- Email exists in database
- Try different email or login

**"Password must contain..."**
- Password doesn't meet strength requirements
- Add uppercase, lowercase, and number

**Network Error**
- Server not running
- Check: `http://localhost:5000/api/auth/register`

**Token not persisting**
- Check localStorage
- Clear cache and retry

## 📊 HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 201 | Success | User created, redirect to dashboard |
| 400 | Bad Request | Show validation error |
| 409 | Conflict | Email exists, suggest login |
| 422 | Validation Error | Show field errors |
| 500 | Server Error | Show generic error, retry |

## 🧪 Test Data

### Valid Users
```javascript
// Customer
{ name: "John Doe", email: "john@test.com", password: "Test123" }

// Staff
{ name: "Jane Staff", email: "jane@test.com", password: "Staff123", role: "staff" }

// Admin
{ name: "Admin User", email: "admin@test.com", password: "Admin123", role: "admin" }
```

### Invalid Users (for testing errors)
```javascript
// Weak password
{ name: "Test", email: "test@test.com", password: "weak" }

// Invalid email
{ name: "Test", email: "invalid", password: "Test123" }

// Short name
{ name: "A", email: "test@test.com", password: "Test123" }

// Duplicate email (run after first success)
{ name: "Duplicate", email: "john@test.com", password: "Test123" }
```

## 📁 Key Files

```
Frontend:
├── src/pages/Register.tsx        # Registration page
├── src/pages/Login.tsx           # Login page (with link)
├── src/store/authStore.ts        # Auth state management
└── src/App.tsx                   # Route configuration

Backend:
├── controllers/auth.controller.js # Registration logic
├── models/user.model.js          # User schema
└── routes/auth.route.js          # API routes

Documentation:
├── docs/REGISTRATION.md          # Full documentation
├── docs/REGISTRATION-SUMMARY.md  # Implementation summary
└── docs/API-TEST-REGISTRATION.md # API testing guide
```

## 🔗 Navigation

```
/login → /register (click "Sign up now")
/register → /login (click "Sign in" or "Back to Login")
/register → /dashboard (after successful registration)
```

## ⚡ Performance Tips

- Form validation runs on client (fast feedback)
- Server validation is secondary (security)
- Token stored in localStorage (persists)
- Auto-login after registration (smooth UX)

## 🎨 UI Components Used

```
- Card (container)
- Input (text fields)
- Button (submit)
- Label (field labels)
- Alert (info message)
- Toast (notifications)
- Framer Motion (animations)
```

## 📱 Responsive Design

```
Mobile:  < 768px   - Full width, single column
Tablet:  768-1024  - Centered, max 600px
Desktop: > 1024px  - Centered, max 500px
```

## ✅ Checklist for Testing

- [ ] Form displays correctly
- [ ] Validation works (all fields)
- [ ] Submit button disables during loading
- [ ] Success redirects to dashboard
- [ ] Duplicate email shows error
- [ ] Weak password shows error
- [ ] Navigation links work
- [ ] Toast notifications appear
- [ ] Mobile view works
- [ ] Token is stored

## 🆘 Need Help?

1. Check full docs: `docs/REGISTRATION.md`
2. Check API tests: `docs/API-TEST-REGISTRATION.md`
3. Check browser console for errors
4. Check server logs for backend errors
5. Verify MongoDB is running
6. Verify server is running on port 5000

## 📞 Contact

For issues or questions:
- Check documentation first
- Review error messages
- Check server logs
- Test with provided examples

---

**Quick Tip**: Use `Test123` as password for all test accounts!
