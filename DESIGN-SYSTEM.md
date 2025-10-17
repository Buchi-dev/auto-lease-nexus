# Consistent Design Pattern & UI Guidelines

## 🎨 Design System Overview

All admin pages now follow a consistent, unified design pattern for better user experience and maintainability.

---

## 📐 Layout Structure

### Standard Page Layout
```tsx
<div className="space-y-6">
  {/* 1. Header Section */}
  <div>
    <h1 className="text-3xl font-bold">[Page Title]</h1>
    <p className="text-muted-foreground">
      [Page description]
    </p>
  </div>

  {/* 2. Stats Grid (4 columns) */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Stats cards with motion animation */}
  </div>

  {/* 3. Filters/Search Card */}
  <Card>
    <CardHeader>
      <CardTitle>[Filter Title]</CardTitle>
      <CardDescription>[Filter Description]</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Filter components */}
    </CardContent>
  </Card>

  {/* 4. Main Content Card */}
  <Card>
    <CardHeader>
      <CardTitle>[Content Title]</CardTitle>
      <CardDescription>[Count/Description]</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Table or list content */}
    </CardContent>
  </Card>
</div>
```

---

## 🎴 Stats Card Pattern

### Consistent Stats Card Structure
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        {/* Left Side: Title, Value, Change */}
        <div>
          <p className="text-sm text-muted-foreground">{stat.title}</p>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
          <div className="flex items-center gap-1 mt-2">
            <FaArrowUp className={`text-xs ${changePositive ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${changePositive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </span>
          </div>
        </div>
        
        {/* Right Side: Icon with background */}
        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
          <stat.icon className={`text-2xl ${stat.color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>
```

### Stats Data Structure
```tsx
const stats = [
  {
    title: 'Stat Title',
    value: '123' or '$45,230',
    icon: FaIconName,
    color: 'text-blue-500',     // Icon color
    bgColor: 'bg-blue-500/10',  // Background with 10% opacity
    change: '+12%',             // Optional: change indicator
    changePositive: true,       // Optional: positive/negative
  },
];
```

---

## 🎨 Color Scheme

### Status Badge Colors
```tsx
const statusColors = {
  // Success states
  available: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  active: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  completed: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
  
  // Warning states
  pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  rented: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  
  // Info states
  confirmed: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  
  // Error states
  cancelled: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  maintenance: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  inactive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};
```

### Role Badge Colors
```tsx
const roleColors = {
  admin: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
  staff: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  customer: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
};
```

### Stats Icon Colors
```tsx
const iconColors = {
  blue: 'text-blue-500' + 'bg-blue-500/10',
  green: 'text-green-500' + 'bg-green-500/10',
  purple: 'text-purple-500' + 'bg-purple-500/10',
  orange: 'text-orange-500' + 'bg-orange-500/10',
  red: 'text-red-500' + 'bg-red-500/10',
};
```

---

## 🎬 Animation Patterns

### Stats Cards Animation
```tsx
// Stagger animation for grid items
{stats.map((stat, index) => (
  <motion.div
    key={stat.title}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {/* Card content */}
  </motion.div>
))}
```

### List Items Animation
```tsx
// Slide in from left for list items
<motion.div
  key={item.id}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
>
  {/* List item content */}
</motion.div>
```

---

## 📝 Typography

### Headers
- **Page Title**: `text-3xl font-bold`
- **Page Description**: `text-muted-foreground`
- **Card Title**: `<CardTitle>` component
- **Card Description**: `<CardDescription>` component

### Content
- **Stat Title**: `text-sm text-muted-foreground`
- **Stat Value**: `text-2xl font-bold`
- **Change Indicator**: `text-xs text-green-500` or `text-red-500`
- **Table/List Items**: Default with `font-medium` for emphasis

---

## 🔘 Button Patterns

### Primary Action Button
```tsx
<Button className="bg-blue-500 hover:bg-blue-600 text-white">
  <FaIcon className="mr-2" />
  Action Text
</Button>
```

### Secondary Action Buttons
```tsx
<Button size="sm" variant="outline">
  <FaIcon className="mr-1" />
  Action
</Button>
```

### Destructive Action
```tsx
<Button size="sm" variant="outline" className="text-red-500">
  <FaTrash />
</Button>
```

---

## 📊 Card Structure

### Standard Card with Header
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or count</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Card Spacing
- **Between cards**: `gap-4` in grid or `space-y-6` for vertical
- **Card padding**: `p-6` for CardContent
- **Inner spacing**: `space-y-3` or `space-y-4` for lists

---

## 🎯 Spacing System

### Page Level
```tsx
<div className="space-y-6">  // Main container
```

### Grid Spacing
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

### List/Stack Spacing
```tsx
<div className="space-y-3">  // Tight spacing for lists
<div className="space-y-4">  // Medium spacing
<div className="space-y-6">  // Loose spacing
```

---

## 🖼️ Loading & Empty States

### Loading State
```tsx
{loading ? (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    <p className="mt-4 text-muted-foreground">Loading {resource}...</p>
  </div>
) : (
  /* Content */
)}
```

### Error State
```tsx
{error && (
  <div className="text-center py-8">
    <p className="text-red-500">{error}</p>
  </div>
)}
```

### Empty State
```tsx
<div className="text-center py-12">
  <FaIcon className="text-5xl text-muted-foreground mx-auto mb-4" />
  <h3 className="text-lg font-semibold mb-2">No {Resource}</h3>
  <p className="text-muted-foreground mb-4">Description text</p>
  <Button>Call to Action</Button>
</div>
```

---

## 📱 Responsive Design

### Grid Breakpoints
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 4 columns
```

### Flex Direction
```tsx
className="flex flex-col md:flex-row gap-4"
// Mobile: Vertical stack
// Desktop: Horizontal row
```

---

## 🎭 Component Patterns

### Badge with Status
```tsx
<Badge className={getStatusBadge(status)}>
  {status.charAt(0).toUpperCase() + status.slice(1)}
</Badge>
```

### Avatar with Fallback
```tsx
<Avatar>
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
</Avatar>
```

### Icon with Text Button
```tsx
<Button size="sm" variant="outline">
  <FaIcon className="mr-1" />
  Text
</Button>
```

---

## ✅ Consistency Checklist

### Every Admin Page Should Have:
- [ ] Consistent header with title + description
- [ ] 4-column stats grid with motion animations
- [ ] Stats with icon on right, colored background
- [ ] Change indicators (green/red arrows)
- [ ] Filter/search card with header
- [ ] Main content card with count in description
- [ ] Loading state with spinner
- [ ] Error state handling
- [ ] Consistent spacing (`space-y-6`, `gap-4`)
- [ ] Consistent button styles
- [ ] Consistent badge colors
- [ ] Responsive grid layouts
- [ ] Proper CardHeader with Title + Description

---

## 🔄 Migration Checklist

When updating existing pages:
1. ✅ Replace page title format
2. ✅ Update stats grid to 4 columns with standard structure
3. ✅ Add icon backgrounds with 10% opacity
4. ✅ Add change indicators with arrows
5. ✅ Wrap filters in Card with CardHeader
6. ✅ Add CardDescription to all cards
7. ✅ Update badge colors to use 10% opacity pattern
8. ✅ Standardize spacing to `space-y-6` and `gap-4`
9. ✅ Add motion animations to stats
10. ✅ Update button styles to match pattern

---

## 📦 Pages Updated

✅ **AdminDashboard.tsx** - Homepage with fleet overview
✅ **Users.tsx** - User management with role badges
✅ **Vehicles.tsx** - Vehicle inventory management
✅ **Bookings.tsx** - Booking management (already consistent)
✅ **Customers.tsx** - Customer management (already consistent)
✅ **Reports.tsx** - Analytics dashboard (already consistent)
✅ **Settings.tsx** - Settings management (already consistent)

---

## 🎨 Design Principles

1. **Consistency**: Same patterns across all pages
2. **Hierarchy**: Clear visual hierarchy with sizing
3. **Spacing**: Generous, consistent spacing
4. **Color**: Semantic colors for status/actions
5. **Animation**: Subtle, purposeful animations
6. **Accessibility**: High contrast, clear labels
7. **Responsiveness**: Mobile-first approach
8. **Feedback**: Loading, error, empty states

---

## 🚀 Benefits

- **User Experience**: Predictable, intuitive interface
- **Development Speed**: Reusable patterns
- **Maintainability**: Easy to update globally
- **Scalability**: Simple to add new pages
- **Accessibility**: Consistent ARIA patterns
- **Performance**: Optimized animations
- **Theme Support**: Works with dark/light modes

---

This design system ensures all admin pages have a unified, professional appearance! 🎉
