export interface JwtPayload {
  id: string;
  email: string;
  role: 'admin';
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}
