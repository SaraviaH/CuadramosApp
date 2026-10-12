export const GUEST_USER_ID = 'guest_local';

export interface CuentaUsuario {
  id: string;
  isLoggedIn: boolean;
  name: string;
  businessName: string;
  email: string;
  avatarUri?: string;
  createdAt?: string;
  updatedAt?: string;
}
