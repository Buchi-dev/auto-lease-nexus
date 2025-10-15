import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@rentdrive.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  staff: {
    id: '2',
    name: 'Staff Member',
    email: 'staff@rentdrive.com',
    role: 'staff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff'
  },
  customer: {
    id: '3',
    name: 'John Doe',
    email: 'customer@rentdrive.com',
    role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string, role: UserRole) => {
        // Mock login - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = mockUsers[role];
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
