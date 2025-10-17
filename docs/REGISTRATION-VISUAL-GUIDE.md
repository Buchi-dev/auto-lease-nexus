# Registration Page - Visual Guide

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                   🚗  RentDrive                              │
│           Professional Car Rental Management System          │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  Sign Up                                                │  │
│  │  Join RentDrive and start exploring amazing vehicles   │  │
│  │                                                         │  │
│  │  👤 Full Name                                           │  │
│  │  [John Doe                                         ]    │  │
│  │                                                         │  │
│  │  ✉️ Email Address                                       │  │
│  │  [john@example.com                                 ]    │  │
│  │                                                         │  │
│  │  🔒 Password                                            │  │
│  │  [••••••••                                         ]    │  │
│  │                                                         │  │
│  │  🔒 Confirm Password                                    │  │
│  │  [••••••••                                         ]    │  │
│  │                                                         │  │
│  │  ℹ️ Password must be at least 6 characters and         │  │
│  │     include uppercase, lowercase, and a number.        │  │
│  │                                                         │  │
│  │  [        Create Account        ]  (Button)            │  │
│  │                                                         │  │
│  │  Already have an account? Sign in                      │  │
│  │                                                         │  │
│  │  ← Back to Login                                       │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  By creating an account, you agree to our Terms of Service  │
│  and Privacy Policy                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Field States

### Normal State
```
┌─────────────────────────────────────────────────────────────┐
│  Full Name                                                    │
│  [John Doe                                              ]     │
└─────────────────────────────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────────────────────────────┐
│  Password                                                     │
│  [abc                                                   ]     │
│  ❌ Password must be at least 6 characters                   │
└─────────────────────────────────────────────────────────────┘
```

### Success State (After Submission)
```
┌─────────────────────────────────────────────────────────────┐
│  ✅ Registration successful! Welcome to RentDrive.           │
│     Redirecting to dashboard...                              │
└─────────────────────────────────────────────────────────────┘
```

## Validation States

### 1. Name Field
```
Empty:          ❌ Name is required
Too Short:      ❌ Name must be at least 2 characters
Valid:          ✅ (no error shown)
```

### 2. Email Field
```
Empty:          ❌ Email is required
Invalid Format: ❌ Please enter a valid email address
Duplicate:      ❌ This email is already registered
Valid:          ✅ (no error shown)
```

### 3. Password Field
```
Empty:          ❌ Password is required
Too Short:      ❌ Password must be at least 6 characters
No Uppercase:   ❌ Password must contain uppercase, lowercase, and number
No Lowercase:   ❌ Password must contain uppercase, lowercase, and number
No Number:      ❌ Password must contain uppercase, lowercase, and number
Valid:          ✅ (no error shown)
```

### 4. Confirm Password Field
```
Empty:          ❌ Please confirm your password
Mismatch:       ❌ Passwords do not match
Valid:          ✅ (no error shown)
```

## User Interaction Flow

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ Click "Sign up now"
       ▼
┌─────────────────┐
│ Register Page   │
│                 │
│ 1. Enter Name   │──❌──▶ Show error if invalid
│ 2. Enter Email  │──❌──▶ Show error if invalid
│ 3. Enter Pass   │──❌──▶ Show error if invalid
│ 4. Confirm Pass │──❌──▶ Show error if invalid
│ 5. Click Button │
└────────┬────────┘
         │ Valid?
         ▼
    ┌────────┐
    │ Submit │
    └────┬───┘
         │
         ├──❌──▶ Show server error
         │
         ▼ ✅
┌─────────────────┐
│ Store Auth      │
│ - User data     │
│ - JWT token     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ Dashboard       │
└─────────────────┘
```

## Password Requirements Visual

```
┌────────────────────────────────────────────────────────────┐
│  Password Requirements:                                     │
│  ─────────────────────────                                  │
│                                                             │
│  ✓  At least 6 characters                                  │
│  ✓  One uppercase letter (A-Z)                             │
│  ✓  One lowercase letter (a-z)                             │
│  ✓  One number (0-9)                                       │
│                                                             │
│  Examples:                                                  │
│  ❌ password     - No uppercase, no number                 │
│  ❌ PASSWORD123  - No lowercase                            │
│  ❌ Pass12       - Too short                               │
│  ✅ Password123  - Valid!                                  │
│  ✅ SecurePass1  - Valid!                                  │
└────────────────────────────────────────────────────────────┘
```

## Loading State

```
┌─────────────────────────────────────────────────────────────┐
│  [    🔄 Creating Account...    ]  (Disabled button)        │
│                                                              │
│  (All form fields are disabled during submission)           │
└─────────────────────────────────────────────────────────────┘
```

## Success Toast Notification

```
┌────────────────────────────────────────────────────┐
│  ✅ Registration successful! Welcome to RentDrive. │
└────────────────────────────────────────────────────┘
```

## Error Toast Notification

```
┌────────────────────────────────────────────┐
│  ❌ Email already in use                   │
└────────────────────────────────────────────┘
```

## Navigation Links

### From Login to Register
```
Login Page
└─▶ "Sign up now" link
    └─▶ Navigate to /register
```

### From Register to Login
```
Register Page
├─▶ "Sign in" link
│   └─▶ Navigate to /login
└─▶ "← Back to Login" button
    └─▶ Navigate to /login
```

## Mobile View

```
┌───────────────────────┐
│  🚗  RentDrive        │
│  Professional Car     │
│  Rental System        │
│                       │
│  ┌─────────────────┐  │
│  │ Sign Up         │  │
│  │                 │  │
│  │ 👤 Full Name    │  │
│  │ [John Doe    ]  │  │
│  │                 │  │
│  │ ✉️ Email        │  │
│  │ [john@ex...  ]  │  │
│  │                 │  │
│  │ 🔒 Password     │  │
│  │ [••••••••    ]  │  │
│  │                 │  │
│  │ 🔒 Confirm      │  │
│  │ [••••••••    ]  │  │
│  │                 │  │
│  │ ℹ️ Password     │  │
│  │ requirements... │  │
│  │                 │  │
│  │ [Create Acct ]  │  │
│  │                 │  │
│  │ Already have?   │  │
│  │ Sign in         │  │
│  │                 │  │
│  │ ← Back to Login │  │
│  └─────────────────┘  │
│                       │
│  Terms & Privacy      │
└───────────────────────┘
```

## Color Scheme

```
Primary Color:     #0066CC (Blue - for buttons, links)
Success Color:     #10B981 (Green - for success messages)
Error Color:       #EF4444 (Red - for error messages)
Background:        #FFFFFF (White)
Card Background:   #F9FAFB (Light Gray)
Border Color:      #E5E7EB (Gray)
Text Color:        #111827 (Dark Gray)
Muted Text:        #6B7280 (Gray)
```

## Animations

```
Page Enter:
  - Fade in (opacity 0 → 1)
  - Scale up (0.95 → 1)
  - Duration: 300ms

Logo:
  - Slide down (y: -20 → 0)
  - Duration: 300ms

Form Fields:
  - Smooth transitions on focus
  - Border color change
  - Duration: 150ms

Error Messages:
  - Fade in
  - Slide down slightly
  - Duration: 200ms

Toast Notifications:
  - Slide in from top-right
  - Duration: 300ms
  - Auto-dismiss: 3 seconds
```

## Responsive Breakpoints

```
Mobile:    < 768px   - Single column, full width
Tablet:    768-1024px - Single column, max-width 600px
Desktop:   > 1024px   - Single column, max-width 500px
```

## Accessibility Features

```
✓ Keyboard Navigation
  - Tab through form fields
  - Enter to submit form
  - Escape to clear focus

✓ Screen Reader Support
  - Proper ARIA labels
  - Error announcements
  - Form field descriptions

✓ Visual Indicators
  - Focus rings on inputs
  - Error borders in red
  - Success indicators

✓ Semantic HTML
  - <form> element
  - <label> for inputs
  - <button> for actions
```

## Browser Support

```
✓ Chrome/Edge (Latest)
✓ Firefox (Latest)
✓ Safari (Latest)
✓ Mobile Browsers
  - iOS Safari
  - Chrome Mobile
  - Samsung Internet
```

---

**TIP**: For the best experience, use the latest version of modern browsers!
