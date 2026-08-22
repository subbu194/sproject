import { Request, Response, NextFunction } from 'express';
import SocialLink from '../models/SocialLink';

export async function getSocialLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const links = await SocialLink.findOne();
    if (!links) {
      res.json({
        success: true,
        data: { whatsapp: '', instagram: '', linkedin: '', twitter: '', facebook: '', email: '' },
      });
      return;
    }
    res.json({ success: true, data: links });
  } catch (err) {
    next(err);
  }
}

export async function updateSocialLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const { whatsapp, instagram, linkedin, twitter, facebook, email } = req.body;
    const links = await SocialLink.findOneAndUpdate(
      {},
      { whatsapp, instagram, linkedin, twitter, facebook, email },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
    res.json({ success: true, data: links });
  } catch (err) {
    next(err);
  }
}
