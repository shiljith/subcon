export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: number;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}
