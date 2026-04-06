declare global {
  namespace Express {
    interface AuthUser {
      id: number;
      email: string;
      role: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
