import { Query } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const paginate = async <T>(
  query: Query<T[], T>,
  options: PaginationOptions
): Promise<PaginatedResult<T>> => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const sort = options.sort || '-createdAt';

  const total = await query.model.countDocuments(query.getFilter());
  const data = await query
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
