export interface PaginationOptions {
  page?: number;
  limit?: number;
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

/**
 * Prisma-friendly paginate helper.
 * Pass a model delegate + where/orderBy/include, returns data + pagination.
 */
export const paginate = async <T>(
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
  },
  args: { where?: any; orderBy?: any; include?: any; select?: any },
  options: PaginationOptions
): Promise<PaginatedResult<T>> => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));

  const [total, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include,
      select: args.select,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

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
