import { Request, Response, NextFunction } from 'express';
import Thought from '../models/Thought';
import { deleteGalleryAndBlurFromR2 } from '../utils/r2ImageDeletion';

const R2_PUBLIC_BASE = process.env.R2_PUBLIC_BASE_URL || '';

function isR2Url(url: string): boolean {
  return !!R2_PUBLIC_BASE && url.startsWith(R2_PUBLIC_BASE);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getPublishedThoughts(req: Request, res: Response, next: NextFunction) {
  try {
    const query: Record<string, any> = { published: true };
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ topic: s }, { title: s }, { summary: s }];
    }
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;
    const thoughts = await Thought.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: thoughts, count: thoughts.length });
  } catch (err) {
    next(err);
  }
}

export async function getAllThoughts(req: Request, res: Response, next: NextFunction) {
  try {
    const query: Record<string, any> = {};
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ topic: s }, { title: s }, { summary: s }];
    }
    if (req.query.published === 'true') query.published = true;
    if (req.query.published === 'false') query.published = false;
    const limit = parseInt(req.query.limit as string) || 500;
    const skip = parseInt(req.query.skip as string) || 0;
    const thoughts = await Thought.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: thoughts, count: thoughts.length });
  } catch (err) {
    next(err);
  }
}

export async function getThoughtById(req: Request, res: Response, next: NextFunction) {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought || !thought.published) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }
    res.json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function createThought(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, title, summary, published, order, images, imageBlurUrls, isOptimized } = req.body;
    if (!topic || !title || !summary) {
      res.status(400).json({ success: false, error: 'Topic, title, and summary are required' });
      return;
    }
    const slug = generateSlug(title);
    const thought = await Thought.create({
      topic,
      title,
      summary,
      slug,
      published,
      order,
      images,
      imageBlurUrls,
      isOptimized,
    });
    res.status(201).json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function updateThought(req: Request, res: Response, next: NextFunction) {
  try {
    // Regenerate slug if title changed
    if (req.body.title) {
      req.body.slug = generateSlug(req.body.title);
    }
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!thought) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }
    res.json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function togglePublishThought(req: Request, res: Response, next: NextFunction) {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }
    thought.published = !thought.published;
    await thought.save();
    res.json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function deleteThought(req: Request, res: Response, next: NextFunction) {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }

    await deleteGalleryAndBlurFromR2(thought.images, thought.imageBlurUrls, isR2Url);

    await Thought.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
