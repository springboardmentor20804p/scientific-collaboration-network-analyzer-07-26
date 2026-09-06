import { Request, Response, NextFunction } from 'express';
import { Conference } from '../models/Conference.model';
import { success, paginate } from '../utils/response';
import { NotFoundError } from '../utils/errors';

// GET /api/v1/conferences
export async function listConferences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const filter: any = {};
    if (status) filter.status = status;

    const total = await Conference.countDocuments(filter);
    const conferences = await Conference.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ startDate: 1 });

    res.json(success('Conferences fetched successfully', paginate(conferences, page, limit, total)));
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/conferences/:id
export async function getConference(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conference = await Conference.findById(req.params.id).populate('organizerIds', 'name email institution');
    if (!conference) throw new NotFoundError('Conference not found');
    res.json(success('Conference details fetched successfully', conference));
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/conferences
export async function createConference(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conference = await Conference.create({
      ...req.body,
      organizerIds: [req.user?.userId],
    });
    res.status(201).json(success('Conference created successfully', conference));
  } catch (error) {
    next(error);
  }
}
