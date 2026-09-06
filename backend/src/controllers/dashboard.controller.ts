import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { Collaboration } from '../models/Collaboration.model';
import { Publication } from '../models/Publication.model';
import { Institution } from '../models/Institution.model';
import { AuditLog } from '../models/AuditLog.model';
import { success } from '../utils/response';

// GET /api/v1/dashboard/stats
export async function getDashboardStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [totalUsers, activeCollaborations, totalPublications, totalInstitutions] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Collaboration.countDocuments({ status: 'active' }),
      Publication.countDocuments({ status: 'published' }),
      Institution.countDocuments({ isVerified: true }),
    ]);

    res.json(
      success('Dashboard statistics fetched successfully', {
        totalUsers,
        activeCollaborations,
        totalPublications,
        totalInstitutions,
      })
    );
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/dashboard/activity
export async function getRecentActivity(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('actorId', 'name email role');

    res.json(success('Recent activity feed fetched successfully', activities));
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/dashboard/metrics
export async function getDashboardMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userRoleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const publicationStatusDistribution = await Publication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json(
      success('Dashboard breakdown metrics fetched successfully', {
        userRoleDistribution,
        publicationStatusDistribution,
      })
    );
  } catch (error) {
    next(error);
  }
}
