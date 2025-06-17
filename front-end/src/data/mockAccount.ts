export interface Account {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'staff' | 'member';
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
    username: 'member',
    password: 'member123',
    email: 'member@example.com',
    role: 'member',
    fullName: 'Regular User'
  }
]; 