import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog.model';
import { logger } from '../config/logger';

export function recordAuditLog(action: string, resourceType?: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Wrap res.send or res.json to catch outcome
    const originalJson = res.json.bind(res);

    res.json = (body: any): Response => {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
      
      AuditLog.create({
        actorId: req.user?.userId,
        actorEmail: req.user?.email,
        actorRole: req.user?.role,
        action,
        resourceType,
        resourceId: req.params.id || body?.data?._id || body?.data?.id,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        status: isSuccess ? 'SUCCESS' : 'FAILURE',
        metadata: {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
        },
      }).catch((err) => logger.error('Failed to log audit entry:', err));

      return originalJson(body);
    };

    next();
  };
}
