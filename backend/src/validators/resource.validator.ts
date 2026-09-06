import { body } from 'express-validator';

export const createCollaborationValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 300 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('researchAreas').isArray({ min: 1 }).withMessage('At least one research area required'),
  body('isPublic').optional().isBoolean(),
  body('tags').optional().isArray(),
];

export const updateCollaborationValidator = [
  body('title').optional().trim().isLength({ max: 300 }),
  body('description').optional().trim(),
  body('status').optional().isIn(['pending', 'active', 'completed', 'rejected']),
  body('isPublic').optional().isBoolean(),
];

export const createPublicationValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 500 }),
  body('abstract').trim().notEmpty().withMessage('Abstract is required'),
  body('researchArea').trim().notEmpty().withMessage('Research area is required'),
  body('authors').isArray({ min: 1 }).withMessage('At least one author required'),
  body('keywords').optional().isArray(),
];

export const submitReviewValidator = [
  body('decision')
    .isIn(['accept', 'minor_revision', 'major_revision', 'reject'])
    .withMessage('Invalid decision'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  body('score').isInt({ min: 1, max: 10 }).withMessage('Score must be 1–10'),
  body('comments').optional().isArray(),
];
