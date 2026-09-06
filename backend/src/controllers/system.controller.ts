import { Request, Response, NextFunction } from 'express';
import { SystemConfig } from '../models/SystemConfig.model';
import { success } from '../utils/response';
import { NotFoundError } from '../utils/errors';

// GET /api/v1/system/config
export async function getSystemConfigs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = req.query.category as string;
    const filter: any = {};
    if (category) filter.category = category;

    const configs = await SystemConfig.find(filter);
    res.json(success('System configurations fetched successfully', configs));
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/system/config
export async function setSystemConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { key, value, category, description, isSecret } = req.body;

    const config = await SystemConfig.findOneAndUpdate(
      { key: key.toUpperCase() },
      {
        key: key.toUpperCase(),
        value,
        category: category || 'general',
        description,
        isSecret: isSecret || false,
        updatedBy: req.user?.userId,
      },
      { upsert: true, new: true }
    );

    res.json(success('System configuration updated successfully', config));
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/system/security
export async function getSecuritySettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const configs = await SystemConfig.find({ category: 'security' });
    res.json(success('Security settings fetched successfully', configs));
  } catch (error) {
    next(error);
  }
}
