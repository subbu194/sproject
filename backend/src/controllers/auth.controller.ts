import { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin';
import { hashPassword, comparePassword, isStrongPassword } from '../utils/password';
import { signJwt } from '../utils/jwt';
import type { JwtPayload } from '../types';

function getAdminSignupLimit() {
  const envLimit = Number(process.env.ADMIN_SIGNUP_LIMIT);
  if (Number.isInteger(envLimit) && envLimit > 0) {
    return envLimit;
  }

  // Safer defaults: single root admin in production, two admins elsewhere.
  return process.env.NODE_ENV === 'production' ? 1 : 2;
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const adminLimit = getAdminSignupLimit();
    const existingCount = await Admin.countDocuments();
    if (existingCount >= adminLimit) {
      res.status(403).json({
        success: false,
        error: `Admin limit reached (${adminLimit}). Contact the team owner to add access.`,
      });
      return;
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({
        success: false,
        error: 'Password must be 8+ chars with uppercase, lowercase, and number',
      });
      return;
    }

    const hashed = await hashPassword(password);
    const admin = await Admin.create({ name, email, password: hashed });

    const payload: JwtPayload = { id: String(admin._id), email: admin.email, role: 'admin' };
    const token = signJwt(payload, process.env.JWT_ADMIN_SECRET!);

    res.status(201).json({
      success: true,
      data: { token, admin: { id: String(admin._id), name: admin.name, email: admin.email } },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const match = await comparePassword(password, admin.password);
    if (!match) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const payload: JwtPayload = { id: String(admin._id), email: admin.email, role: 'admin' };
    const token = signJwt(payload, process.env.JWT_ADMIN_SECRET!);

    res.json({
      success: true,
      data: { token, admin: { id: String(admin._id), name: admin.name, email: admin.email } },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await Admin.findById(req.admin!.id).select('-password');
    if (!admin) {
      res.status(404).json({ success: false, error: 'Admin not found' });
      return;
    }
    res.json({
      success: true,
      data: { admin: { id: String(admin._id), name: admin.name, email: admin.email } },
    });
  } catch (err) {
    next(err);
  }
}
