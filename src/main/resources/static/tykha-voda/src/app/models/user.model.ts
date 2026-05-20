export interface User {
  id?: number;
  username: string;
  email: string;
  phone?: string;
  admin: boolean;
  discount: number;
}