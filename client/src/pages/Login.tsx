import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCar, FaEnvelope, FaLock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { toast } from 'sonner';

const roles: { value: UserRole; label: string; description: string; gradient: string }[] = [
  { value: 'admin', label: 'Administrator', description: 'Full system access', gradient: 'admin-gradient' },
  { value: 'staff', label: 'Staff Member', description: 'Operations & bookings', gradient: 'staff-gradient' },
  { value: 'customer', label: 'Customer', description: 'Browse & book vehicles', gradient: 'customer-gradient' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <FaCar className="text-5xl text-primary" />
            <h1 className="text-4xl font-bold">RentDrive</h1>
          </motion.div>
          <p className="text-muted-foreground">Professional Car Rental Management System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Role</CardTitle>
              <CardDescription>Choose how you want to access the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {roles.map((role) => (
                <motion.button
                  key={role.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedRole === role.value
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{role.label}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full ${role.gradient}`} />
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@rentdrive.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Demo credentials:</p>
                  <p className="mt-1">Any email/password works with selected role</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
