import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { Publication } from '../models/Publication.model';
import { Collaboration } from '../models/Collaboration.model';
import { AuditLog } from '../models/AuditLog.model';

// GET /api/v1/reports/export/csv?type=users|publications|collaborations|audit
export async function exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const type = (req.query.type as string) || 'users';

    let csvContent = '';

    if (type === 'users') {
      const users = await User.find().select('name email role isActive createdAt').lean();
      csvContent = 'ID,Name,Email,Role,IsActive,CreatedAt\n' +
        users.map((u) => `"${u._id}","${u.name}","${u.email}","${u.role}","${u.isActive}","${u.createdAt}"`).join('\n');
    } else if (type === 'publications') {
      const pubs = await Publication.find().select('title status citationCount publishedAt createdAt').lean();
      csvContent = 'ID,Title,Status,CitationCount,PublishedAt,CreatedAt\n' +
        pubs.map((p) => `"${p._id}","${p.title.replace(/"/g, '""')}","${p.status}",${p.citationCount},"${p.publishedAt || ''}","${p.createdAt}"`).join('\n');
    } else if (type === 'collaborations') {
      const collabs = await Collaboration.find().select('title status createdAt').lean();
      csvContent = 'ID,Title,Status,CreatedAt\n' +
        collabs.map((c) => `"${c._id}","${c.title.replace(/"/g, '""')}","${c.status}","${c.createdAt}"`).join('\n');
    } else if (type === 'audit') {
      const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(500).lean();
      csvContent = 'ID,ActorEmail,ActorRole,Action,ResourceType,Status,CreatedAt\n' +
        logs.map((l) => `"${l._id}","${l.actorEmail || ''}","${l.actorRole || ''}","${l.action}","${l.resourceType || ''}","${l.status}","${l.createdAt}"`).join('\n');
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=scicollab_${type}_report.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}
