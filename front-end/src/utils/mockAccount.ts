export interface Account {
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'staff' | 'user';
  }
  
  export const mockAccounts: Account[] = [
    {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      role: 'admin'
    },
    {
      username: 'staff',
      password: 'staff123',
      email: 'staff@example.com',
      role: 'staff'
    },
    {
      username: 'user',
      password: 'user123',
      email: 'user@example.com',
      role: 'user'
    }
  ];