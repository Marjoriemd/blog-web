export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
  parentId?: number | null;
  replies?: Comment[];
}

export interface AuthTokens {
  token_type: string;
  expiration: string;
  access_token: string;
}

export interface ApiError {
  error: {
    status: number;
    message: string;
    details?: { field: string; message: string }[];
  };
}
