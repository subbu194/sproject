import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyJwt(token);
    if (decoded.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }
}
