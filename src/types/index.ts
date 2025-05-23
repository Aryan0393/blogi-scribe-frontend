
export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirm_password?: string;
}
