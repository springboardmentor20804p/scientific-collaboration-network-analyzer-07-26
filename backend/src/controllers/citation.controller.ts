import { Request, Response, NextFunction } from 'express';
import { Citation } from '../models/Citation.model';
import { Publication } from '../models/Publication.model';
import { success } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';

// POST /api/v1/citations
export async function addCitation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sourcePublicationId, targetPublicationId, context } = req.body;

    if (sourcePublicationId === targetPublicationId) {
      throw new BadRequestError('Publication cannot cite itself');
    }

    const [source, target] = await Promise.all([
      Publication.findById(sourcePublicationId),
      Publication.findById(targetPublicationId),
    ]);

    if (!source || !target) {
      throw new NotFoundError('One or both publications not found');
    }

    const citation = await Citation.create({
      sourcePublicationId,
      targetPublicationId,
      context,
    });

    // Increment target publication's citation count
    target.citationCount += 1;
    await target.save();

    res.status(201).json(success('Citation added successfully', citation));
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/citations/publication/:id
export async function getPublicationCitations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pubId = req.params.id;

    const [citedBy, references] = await Promise.all([
      Citation.find({ targetPublicationId: pubId }).populate('sourcePublicationId', 'title authors publishedAt doi'),
      Citation.find({ sourcePublicationId: pubId }).populate('targetPublicationId', 'title authors publishedAt doi'),
    ]);

    res.json(
      success('Citation graph details fetched successfully', {
        publicationId: pubId,
        totalCitations: citedBy.length,
        citedBy,
        references,
      })
    );
  } catch (error) {
    next(error);
  }
}
