import { ApiResponse } from '../types';

export function success<T>(message: string, data?: T): ApiResponse<T> {
  return { success: true, message, data };
}

export function failure(message: string, errors?: string[]): ApiResponse {
  return { success: false, message, errors };
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
