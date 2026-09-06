// ─── Shared Role Type (mirrors frontend RoleContext) ──────────────────────────
export type Role = 'Researcher' | 'Institution Admin' | 'System Admin' | 'Reviewer';

// ─── Collaboration Status ─────────────────────────────────────────────────────
export type CollaborationStatus = 'pending' | 'active' | 'completed' | 'rejected';

// ─── Publication Status ───────────────────────────────────────────────────────
export type PublicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'published' | 'rejected';

// ─── Review Decision ──────────────────────────────────────────────────────────
export type ReviewDecision = 'pending' | 'accept' | 'minor_revision' | 'major_revision' | 'reject';

// ─── Generic API Response ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// ─── Paginated Result ─────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email?: string;
  role: Role;
  institutionId?: string;
  iat?: number;
  exp?: number;
}
