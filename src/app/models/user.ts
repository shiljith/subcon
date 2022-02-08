export interface User {
  id: number;
  fullName: string;
  username: string;
  role: number;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}
