# Visual Page Structure Guide

## 🎨 Page Layout Patterns

### Admin/Bookings Page
```
┌─────────────────────────────────────────────┐
│ 📋 Bookings Management                      │
│ View and manage vehicle bookings            │
├─────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │Total│ │Pend-│ │Activ│ │Comp-│            │
│ │  12 │ │ing 3│ │e  5 │ │lete │            │
│ └─────┘ └─────┘ └─────┘ └─────┘            │
├─────────────────────────────────────────────┤
│ 🔍 Filter Bookings                          │
│ [Search.....................] [Status ▼]    │
├─────────────────────────────────────────────┤
│ 📊 All Bookings Table                       │
│ ┌───┬────────┬────────┬──────┬────────┐    │
│ │ID │Customer│Vehicle │Dates │Status  │    │
│ ├───┼────────┼────────┼──────┼────────┤    │
│ │001│John Doe│Camry   │10/20 │[Pending]   │
│ │002│Jane S. │CR-V    │10/18 │[Active]│   │
│ └───┴────────┴────────┴──────┴────────┘    │
│          [View] [Edit]                      │
└─────────────────────────────────────────────┘

📱 DIALOGS:
┌──────────────────┐  ┌──────────────────┐
│ View Details     │  │ Edit Status      │
│ • Booking Info   │  │ [Status Dropdown]│
│ • Customer Info  │  │ [Update] [Cancel]│
│ [Close]          │  └──────────────────┘
└──────────────────┘
```

### Admin/Customers Page
```
┌─────────────────────────────────────────────┐
│ 👥 Customer Management                      │
│ View and manage customer accounts           │
├─────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │Total│ │Active│ │New  │ │ VIP │            │
│ │ 156 │ │  89  │ │  12 │ │  8  │            │
│ └─────┘ └─────┘ └─────┘ └─────┘            │
├─────────────────────────────────────────────┤
│ 🔍 Search: [.........................]      │
├─────────────────────────────────────────────┤
│ 📊 Customers Table                          │
│ ┌────┬──────────┬─────────┬────────┐       │
│ │👤  │Name      │Contact  │Bookings│       │
│ ├────┼──────────┼─────────┼────────┤       │
│ │[JD]│John Doe  │john@... │   15   │       │
│ │[JS]│Jane Smith│jane@... │    8   │       │
│ └────┴──────────┴─────────┴────────┘       │
│                [View Details]               │
└─────────────────────────────────────────────┘
```

### Admin/Reports Page
```
┌─────────────────────────────────────────────┐
│ 📊 Analytics & Reports                      │
│ View business metrics and analytics         │
├─────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│ │Revenue │ │Active  │ │ Avg    │ │ Fleet  ││
│ │$45,230 │ │Booking │ │ Rental │ │Utiliza ││
│ │↑ 12.5% │ │   34   │ │  $285  │ │  78%   ││
│ └────────┘ └────────┘ └────────┘ └────────┘│
├─────────────────────────────────────────────┤
│ [Revenue] [Bookings] [Utilization]          │
├─────────────────────────────────────────────┤
│  📈 Revenue Analysis (Bar Chart)            │
│  ▁▃▅▇█▇▅▃ Monthly Revenue Trend            │
│  ┌─────────────────────────────────┐       │
│  │     [Bar Chart Visualization]    │       │
│  │ Jan Feb Mar Apr May Jun Jul Aug  │       │
│  └─────────────────────────────────┘       │
├─────────────────────────────────────────────┤
│ 💡 Insights                                 │
│ • Revenue increased 12.5% this month        │
│ • Top vehicle: Tesla Model 3 (24 bookings) │
└─────────────────────────────────────────────┘
```

### Admin/Settings Page
```
┌─────────────────────────────────────────────┐
│ ⚙️ Settings                                  │
│ Configure your application settings         │
├─────────────────────────────────────────────┤
│ [General] [Notifications] [Business] [Security]
├─────────────────────────────────────────────┤
│ 🏢 Company Information                      │
│ Company Name: [.....................]       │
│ Email:        [.....................]       │
│ Phone:        [.....................]       │
│ Address:      [.....................]       │
│               [.....................]       │
│ Timezone:     [UTC-5:00 EST      ▼]        │
│ Language:     [English (US)      ▼]        │
│                                             │
│                        [Save Changes]       │
└─────────────────────────────────────────────┘

[Notifications Tab]
┌─────────────────────────────────────────────┐
│ 🔔 Notification Preferences                 │
│ Email Notifications        [●────────] ON   │
│ SMS Notifications          [○────────] OFF  │
│ New Booking Alerts         [●────────] ON   │
│ Payment Confirmations      [●────────] ON   │
│                        [Save Preferences]   │
└─────────────────────────────────────────────┘
```

### Staff/Bookings Page
```
┌─────────────────────────────────────────────┐
│ 📋 Bookings Management (Staff View)         │
│ View and manage vehicle bookings            │
├─────────────────────────────────────────────┤
│ Similar to Admin/Bookings but:              │
│ • Limited to viewing/editing status         │
│ • No delete functionality                   │
│ • Same UI components and layout             │
└─────────────────────────────────────────────┘
```

### Customer/MyBookings Page
```
┌─────────────────────────────────────────────┐
│ 🚗 My Bookings                              │
│ View and manage all your vehicle bookings   │
├─────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐                    │
│ │Active│ │Upcom│ │Compl│                    │
│ │  2   │ │ing 1│ │eted │                    │
│ └─────┘ └─────┘ └─────┘                    │
├─────────────────────────────────────────────┤
│ [Active & Upcoming] [Past] [All Bookings]   │
├─────────────────────────────────────────────┤
│ 🎴 CARD VIEW (not table):                   │
│ ┌───────────────────────────────────────┐   │
│ │ Booking #001              [Confirmed] │   │
│ │ Downtown Office                       │   │
│ │ 📅 Pickup:  Oct 20, 2025             │   │
│ │ 📅 Return:  Oct 25, 2025             │   │
│ │ Total: $450        [View] [Cancel]   │   │
│ └───────────────────────────────────────┘   │
│ ┌───────────────────────────────────────┐   │
│ │ Booking #002                [Active]  │   │
│ │ Airport Terminal                      │   │
│ │ 📅 Pickup:  Oct 18, 2025             │   │
│ │ 📅 Return:  Oct 22, 2025             │   │
│ │ Total: $320        [View]            │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

EMPTY STATE:
┌─────────────────────────────────────────────┐
│         🚗                                  │
│    No Active Bookings                       │
│ You don't have any active bookings          │
│         [Browse Vehicles]                   │
└─────────────────────────────────────────────┘
```

### Customer/Profile Page
```
┌─────────────────────────────────────────────┐
│ 👤 My Profile                               │
│ Manage your account settings                │
├─────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐  │
│ │  [👤]  John Doe           📷           │  │
│ │        john@example.com                │  │
│ │        Member since 2025               │  │
│ └────────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│ [Personal Info] [Security] [Notifications] [Payment]
├─────────────────────────────────────────────┤
│ 👤 Personal Information                     │
│ Full Name:       [.....................]    │
│ Email:           [.....................]    │
│ Phone:           [.....................]    │
│ Date of Birth:   [2025-01-15]              │
│ Driver's License:[.....................]    │
│ Address:         [.....................]    │
│                  [.....................]    │
│                        [Save Changes]       │
└─────────────────────────────────────────────┘

[Security Tab]
┌─────────────────────────────────────────────┐
│ 🔒 Security Settings                        │
│ Current Password:  [.....................]  │
│ New Password:      [.....................]  │
│ Confirm Password:  [.....................]  │
│                        [Update Password]    │
│────────────────────────────────────────────│
│ Two-Factor Auth    [●────────] ENABLED     │
│────────────────────────────────────────────│
│ 💻 Active Sessions                          │
│ Windows - Chrome         [Active]          │
└─────────────────────────────────────────────┘

[Notifications Tab]
┌─────────────────────────────────────────────┐
│ 🔔 Notification Preferences                 │
│ Email Notifications        [●────] ON       │
│ SMS Notifications          [○────] OFF      │
│ Booking Updates            [●────] ON       │
│ Promotions & Offers        [●────] ON       │
│ Newsletter                 [○────] OFF      │
│                        [Save Preferences]   │
└─────────────────────────────────────────────┘

[Payment Tab]
┌─────────────────────────────────────────────┐
│ 💳 Payment Methods                          │
│ ┌──────────────────────────────────────┐   │
│ │ 💳 Visa •••• 4242        [Default]   │   │
│ │    Expires 12/25                     │   │
│ │           [Set Default] [Remove]     │   │
│ └──────────────────────────────────────┘   │
│ ┌──────────────────────────────────────┐   │
│ │ 💳 Mastercard •••• 8888              │   │
│ │    Expires 03/26                     │   │
│ │           [Set Default] [Remove]     │   │
│ └──────────────────────────────────────┘   │
│ [+ Add New Payment Method]                 │
└─────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Status Badges
```
🟡 Pending    → bg-yellow-500/10 text-yellow-500
🔵 Confirmed  → bg-blue-500/10 text-blue-500
🟢 Active     → bg-green-500/10 text-green-500
⚪ Completed  → bg-gray-500/10 text-gray-500
🔴 Cancelled  → bg-red-500/10 text-red-500
```

### Stats Cards
```
📊 Primary Stat   → text-2xl font-bold
📝 Label          → text-sm text-muted-foreground
📈 Trend          → text-xs text-green-500 (positive)
📉 Trend          → text-xs text-red-500 (negative)
```

---

## 🔀 Navigation Flow

```
LOGIN
  ↓
ROLE CHECK
  ↓
┌─────────────┬─────────────┬─────────────┐
│   ADMIN     │    STAFF    │  CUSTOMER   │
└─────────────┴─────────────┴─────────────┘
       ↓              ↓              ↓
   Dashboard      Dashboard      Dashboard
       ↓              ↓              ↓
    Users         Vehicles     Browse Vehicles
    Vehicles      Bookings     My Bookings
    Bookings      Customers    Profile
    Customers
    Reports
    Settings
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├─ Stack cards vertically
├─ Sidebar becomes drawer (hamburger menu)
├─ Tables become scrollable
└─ Forms full-width

Tablet (768px - 1024px)
├─ 2-column grid for stats
├─ Sidebar visible but collapsible
└─ Tables with horizontal scroll

Desktop (> 1024px)
├─ 4-column grid for stats
├─ Full sidebar visible
├─ Tables with full columns
└─ Side-by-side layouts
```

---

## 🎭 Animation Patterns

### Page Enter
```
opacity: 0 → 1
y: 20px → 0px
duration: 0.3s
```

### Card Hover
```
scale: 1 → 1.02
transition: 0.2s ease
```

### Dialog
```
Overlay: fade in (0 → 1)
Content: scale up (0.95 → 1)
```

---

## 🧩 Component Hierarchy

```
DashboardLayout
  └─ Sidebar
  └─ Main Content
      ├─ Header (Title + Description)
      ├─ Stats Row
      │   └─ Card (4x)
      ├─ Filters Card
      │   ├─ Input (Search)
      │   └─ Select (Filters)
      ├─ Content Card
      │   └─ Table OR Card Grid
      └─ Dialogs
          ├─ Details Dialog
          ├─ Edit Dialog
          └─ Confirm Dialog
```

---

## 🎯 Interaction Patterns

### Admin/Staff
1. **View List** → Click row/button
2. **Open Details** → Modal appears
3. **Edit** → Form in modal
4. **Submit** → Toast notification
5. **Refresh** → Updated data

### Customer
1. **View Bookings** → Card grid
2. **Click View** → Details modal
3. **Cancel** → Confirm dialog
4. **Confirm** → Toast + refresh
5. **Update Profile** → Save → Toast

---

## 📊 Data Flow

```
Component Mount
    ↓
useEffect() triggers
    ↓
fetchData() called
    ↓
setLoading(true)
    ↓
API Call (or mock data)
    ↓
Success → setData()
Error → toast.error()
    ↓
setLoading(false)
    ↓
Render UI
```

---

## 🎁 Component Reusability

### Shared Patterns
```typescript
// Stats Card
<Card>
  <CardContent>
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-muted">Label</p>
        <p className="text-2xl font-bold">Value</p>
      </div>
      <Icon className="text-3xl" />
    </div>
  </CardContent>
</Card>

// Status Badge
const getStatusBadge = (status: string) => (
  <Badge className={statusColors[status]}>
    {status}
  </Badge>
);

// Empty State
<Card>
  <CardContent className="p-12 text-center">
    <Icon className="text-5xl mx-auto mb-4" />
    <h3>No Data</h3>
    <p className="text-muted">Description</p>
    <Button>Call to Action</Button>
  </CardContent>
</Card>
```

---

## ✨ Special Features

### Admin/Reports
- 📊 **Chart.js Integration**: Bar, Pie, Line charts
- 📈 **Trend Indicators**: Up/down arrows with percentages
- 🎨 **Color Coded**: Different colors for each metric

### Customer/MyBookings
- 🎴 **Card Layout**: Better UX than table for customers
- ⏰ **Empty States**: Helpful CTAs when no data
- 🎬 **Animations**: Smooth card transitions

### Customer/Profile
- 🖼️ **Avatar Upload**: Camera icon for photo change
- 🔐 **Security**: Password requirements, 2FA toggle
- 💳 **Payment**: Multiple payment methods management

---

This visual guide shows the complete structure and design patterns used across all 7 new pages! 🚀
