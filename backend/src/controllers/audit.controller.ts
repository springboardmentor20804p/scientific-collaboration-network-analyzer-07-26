import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog.model';
import { success, paginate } from '../utils/response';

// GET /api/v1/audit-logs
export async function listAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const action = req.query.action as string;
    const actorEmail = req.query.actorEmail as string;

    const filter: any = {};
    if (action) filter.action = action;
    if (actorEmail) filter.actorEmail = actorEmail;

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json(success('Audit logs fetched successfully', paginate(logs, page, limit, total)));
  } catch (error) {
    next(error);
  }
}
