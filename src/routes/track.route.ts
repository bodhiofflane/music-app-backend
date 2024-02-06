import { Router } from 'express';
import { addTrackController, deleteTrackByIdController, getAllTracksController, getTrackByIdContoller, updateTrackByIdController } from '../controllers/track.controller';

const trackRounter = Router();

// Добавление трека в альбом.
trackRounter.post('/', addTrackController);

// Получение трека по id
trackRounter.get('/:trackId', getTrackByIdContoller);

// Получение всех треков
trackRounter.get('/', getAllTracksController);

// обновление трека
trackRounter.put('/:trackId', updateTrackByIdController);

// Удаление терка из альбома
trackRounter.delete('/:trackId', deleteTrackByIdController);

export default trackRounter;