import { Router, Request, Response } from 'express';

export const userRoute: Router = Router();

const names = [
  'Сэр Корвалол',
  'Рыцарь-о-пончик',
  'Лунный танцор',
  'Солнечный зайчик',
  'Капитан Подсолнух',
  'Гусеница-путешественница',
  'Шоколадный магнат',
];

userRoute.get('/api/me', (_req: Request, res: Response) => {
  const name = names[new Date().getDay()];

  res.json({ name });
});
