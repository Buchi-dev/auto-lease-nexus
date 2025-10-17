# Quick Design Reference Card

## 🎨 Copy-Paste Patterns

### Stats Card Template
```tsx
const stats = [
  {
    title: 'Total Count',
    value: '123',
    icon: FaIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    change: '+12%',
    changePositive: true,
  },
];

// Render
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat, index) => (
    <motion.div
      key={stat.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <FaArrowUp className={`text-xs ${stat.changePositive ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${stat.changePositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`text-2xl ${stat.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

### Status Badge Helper
```tsx
const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    // Green - Success
    available: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    active: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    completed: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
    
    // Yellow/Orange - Warning
    pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    rented: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    
    // Blue - Info
    confirmed: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    
    // Red - Danger
    cancelled: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    maintenance: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  };
  
  return (
    <Badge className={variants[status] || ''}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
```

### Page Structure Template
```tsx
export default function PageName() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Page Title</h1>
          <p className="text-muted-foreground">Page description</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <FaPlus className="mr-2" />
          Add New
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats cards here */}
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Title</CardTitle>
          <CardDescription>Filter description</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter components */}
        </CardContent>
      </Card>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Content Title</CardTitle>
          <CardDescription>{count} item(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          ) : (
            /* Content here */
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### List Item with Animation
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md hover:border-primary/50 transition-all"
  >
    {/* Item content */}
  </motion.div>
))}
```

## 🎨 Color Quick Reference

```tsx
// Icon Colors
'text-blue-500'   + 'bg-blue-500/10'
'text-green-500'  + 'bg-green-500/10'
'text-purple-500' + 'bg-purple-500/10'
'text-orange-500' + 'bg-orange-500/10'
'text-red-500'    + 'bg-red-500/10'

// Status Colors (10% opacity backgrounds)
Success:  'bg-green-500/10 text-green-500 hover:bg-green-500/20'
Warning:  'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
Info:     'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
Danger:   'bg-red-500/10 text-red-500 hover:bg-red-500/20'
```

## 📐 Spacing Quick Reference

```tsx
// Page container
<div className="space-y-6">

// Grid spacing
className="gap-4"

// Card padding
<CardContent className="p-6">

// List spacing (tight)
<div className="space-y-3">

// List spacing (medium)
<div className="space-y-4">
```

## 🔘 Button Quick Reference

```tsx
// Primary
<Button className="bg-blue-500 hover:bg-blue-600 text-white">

// Secondary
<Button variant="outline">

// Small with icon
<Button size="sm" variant="outline">
  <FaIcon className="mr-1" />
  Text
</Button>

// Icon only
<Button size="sm" variant="outline">
  <FaIcon />
</Button>

// Destructive
<Button size="sm" variant="outline" className="text-red-500">
```

## 🎬 Animation Quick Reference

```tsx
// Stats cards (stagger 100ms)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>

// List items (stagger 50ms)
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

## 📊 Stats Data Structure

```tsx
{
  title: 'Stat Title',        // text-sm text-muted-foreground
  value: '123',               // text-2xl font-bold
  icon: FaIconName,           // React icon component
  color: 'text-blue-500',     // Icon color
  bgColor: 'bg-blue-500/10',  // Background (10% opacity)
  change: '+12%',             // Optional
  changePositive: true,       // Optional (green/red)
}
```

## 🎯 Common Imports

```tsx
import { motion } from 'framer-motion';
import { FaIcon1, FaIcon2, FaArrowUp } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
```

---

**Print this card and keep it handy!** 📎
