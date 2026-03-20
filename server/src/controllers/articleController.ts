import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { paginate } from '../utils/pagination';

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  const { category, tag } = req.query;
  const filter: any = { isPublished: true };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;

  const result = await paginate(
    Article.find(filter).populate('author', 'name avatarUrl'),
    {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sort: '-createdAt',
    }
  );
  res.json(result);
};

export const getArticle = async (req: Request, res: Response): Promise<void> => {
  const article = await Article.findOne({
    $or: [{ 'slug.en': req.params.slug }, { 'slug.ar': req.params.slug }],
  }).populate('author', 'name avatarUrl bio');
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json(article);
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json(article);
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json({ message: 'Article deleted' });
};

export const adminGetArticles = async (req: Request, res: Response): Promise<void> => {
  const result = await paginate(Article.find().populate('author', 'name'), {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    sort: '-createdAt',
  });
  res.json(result);
};
