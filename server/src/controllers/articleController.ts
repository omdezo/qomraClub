import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { paginate } from '../utils/pagination';

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  const { category, tag } = req.query;
  const where: any = { isPublished: true };
  if (category) where.category = category;
  if (tag) where.tags = { has: tag };

  const result = await paginate(
    prisma.article,
    { where, orderBy: { createdAt: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};

export const getArticle = async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;
  const articles = await prisma.article.findMany({ where: { OR: [{ slug: { path: ['en'], equals: slug } }, { slug: { path: ['ar'], equals: slug } }] }, take: 1 });
  const article = articles[0];
  if (!article) { res.status(404).json({ message: 'Article not found' }); return; }
  res.json(article);
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const article = await prisma.article.create({ data: req.body });
  res.status(201).json(article);
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await prisma.article.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(article);
  } catch { res.status(404).json({ message: 'Article not found' }); }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.article.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Article deleted' });
  } catch { res.status(404).json({ message: 'Article not found' }); }
};

export const adminGetArticles = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(
    prisma.article,
    { orderBy: { createdAt: 'desc' } },
    { page: Number(req.query.page) || 1, limit: Number(req.query.limit) || 20 }
  );
  res.json(result);
};
