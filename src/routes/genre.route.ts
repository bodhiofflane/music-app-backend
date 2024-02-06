import { Router } from 'express';
import {
  createGenreController,
  deleteGenreByIdController,
  getAllGenresController,
  getGenreByIdController,
  updateGenreByIdController,
} from '../controllers/genre.controller';

const genreRouter = Router();

genreRouter.post('/', createGenreController);
genreRouter.get('/', getAllGenresController);
genreRouter.get('/:genreId', getGenreByIdController);
genreRouter.put('/:genreId', updateGenreByIdController);
genreRouter.delete('/:genreId', deleteGenreByIdController);

export default genreRouter;
