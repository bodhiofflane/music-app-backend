import { Router } from 'express';
import {
  createAlbumController,
  deleteAlbumByIdController,
  getAlbumByIdController,
  getAllAlbumsController,
  updateAlbumByIdController,
} from '../controllers/album.controller';

const albumRouter = Router();

albumRouter.post('/', createAlbumController);
albumRouter.get('/', getAllAlbumsController);
albumRouter.get('/:albumId', getAlbumByIdController);
albumRouter.put('/:albumId', updateAlbumByIdController);
albumRouter.delete('/:albumId', deleteAlbumByIdController);

export default albumRouter;
