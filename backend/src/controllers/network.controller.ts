import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { Collaboration } from '../models/Collaboration.model';
import { Publication } from '../models/Publication.model';
import { Institution } from '../models/Institution.model';
import { success } from '../utils/response';

/**
 * GET /api/v1/network/graph
 * Returns nodes (researchers) and edges (collaborations) for graph visualisation.
 */
export async function getNetworkGraph(req: Request, res: Response, next: NextFunction) {
  try {
    const institutionId = req.query.institutionId as string | undefined;
    const researchArea  = req.query.researchArea  as string | undefined;

    const collabFilter: Record<string, unknown> = { status: 'active', isPublic: true };
    if (researchArea) collabFilter.researchAreas = researchArea;

    const collabs = await Collaboration.find(collabFilter)
      .populate('members', 'name email role institutionId')
      .populate('institutions', 'name domain');

    // Build unique node set
    const nodeMap = new Map<string, unknown>();
    const edges: { source: string; target: string; collaborationId: string; title: string }[] = [];

    for (const collab of collabs) {
      const members = collab.members as any[];
      if (institutionId) {
        const belongs = members.some(m => String(m.institutionId) === institutionId);
        if (!belongs) continue;
      }
      members.forEach(m => nodeMap.set(String(m._id), { id: String(m._id), name: m.name, role: m.role, institutionId: m.institutionId }));

      // Edges: all pairs in collab
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          edges.push({
            source: String(members[i]._id),
            target: String(members[j]._id),
            collaborationId: String(collab._id),
            title: collab.title,
          });
        }
      }
    }

    res.json(success('Network graph', { nodes: Array.from(nodeMap.values()), edges }));
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/network/stats
 * Platform-wide statistics for the dashboard.
 */
export async function getNetworkStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [
      totalResearchers,
      totalInstitutions,
      totalCollaborations,
      totalPublications,
      activeCollaborations,
    ] = await Promise.all([
      User.countDocuments({ role: 'Researcher', isActive: true }),
      Institution.countDocuments({ isVerified: true }),
      Collaboration.countDocuments(),
      Publication.countDocuments({ status: 'published' }),
      Collaboration.countDocuments({ status: 'active' }),
    ]);

    res.json(success('Network stats', {
      totalResearchers,
      totalInstitutions,
      totalCollaborations,
      totalPublications,
      activeCollaborations,
    }));
  } catch (err) { next(err); }
}

/**
 * GET /api/v1/network/top-researchers
 * Top researchers by collaboration count.
 */
export async function getTopResearchers(_req: Request, res: Response, next: NextFunction) {
  try {
    const top = await Collaboration.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$members' },
      { $group: { _id: '$members', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$_id', name: '$user.name', email: '$user.email', collaborationCount: '$count' } },
    ]);
    res.json(success('Top researchers', { researchers: top }));
  } catch (err) { next(err); }
}
