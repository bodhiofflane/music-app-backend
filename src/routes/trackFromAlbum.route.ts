import { Router } from 'express';
import { createTrackFromAlbumController, getAllTracksFromAlbumByAlbumIdController } from '../controllers/trackFromAlbum.controller';

const trackFromAlbumRouter = Router();

// Создать трек в альбоме
trackFromAlbumRouter.post('/', createTrackFromAlbumController);

// Получить все треки с сальбома.
trackFromAlbumRouter.get('/:albumId', getAllTracksFromAlbumByAlbumIdController);

export default trackFromAlbumRouter;