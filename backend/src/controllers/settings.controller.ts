import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch settings';
    res.status(500).json({ success: false, error: errMessage });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { heroVideoUrl } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({ heroVideoUrl });
    } else {
      settings.heroVideoUrl = heroVideoUrl !== undefined ? heroVideoUrl : settings.heroVideoUrl;
      await settings.save();
    }
    
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update settings';
    res.status(500).json({ success: false, error: errMessage });
  }
};
