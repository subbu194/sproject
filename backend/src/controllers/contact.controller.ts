import { Request, Response, NextFunction } from 'express';
import ContactSubmission from '../models/ContactSubmission';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Name, email, and message are required' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ success: false, error: 'Invalid email format' });
      return;
    }
    await ContactSubmission.create({ name, email, message });
    res.status(201).json({ success: true, data: { message: 'Message sent successfully' } });
  } catch (err) {
    next(err);
  }
}

export async function getContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const query: Record<string, any> = {};
    if (req.query.unread === 'true') {
      query.read = false;
    }
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: s }, { email: s }, { message: s }];
    }
    const submissions = await ContactSubmission.find(query).sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions, count: submissions.length });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { returnDocument: 'after' }
    );
    if (!submission) {
      res.status(404).json({ success: false, error: 'Submission not found' });
      return;
    }
    res.json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
}

export async function deleteContact(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) {
      res.status(404).json({ success: false, error: 'Submission not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
