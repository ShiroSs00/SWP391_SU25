export interface Account {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  fullName: string;
}

export const mockAccounts: Account[] = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    fullName: 'Admin User'
  },
  {
    username: 'staff',
    password: 'staff123',
    email: 'staff@example.com',
    role: 'staff',
    fullName: 'Staff User'
  },
  {
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    role: 'user',
    fullName: 'Regular User'
  }
]; 