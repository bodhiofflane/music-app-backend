import { RequestHandler } from 'express';
import {
  spaceRemovalService,
  stringCheckService,
} from '../services/string.service';
import {
  saveAudioToDirAndReturnUrlService,
  selectFileFromRecivedFilesService,
} from '../services/file.service';
import { createTrackFromAlbumService, getAllTracksFromAlbumByAlbumIdService } from '../services/trackFromAlbum.service';
import { conversionToNumberService } from '../services/number.service';
import { getAlbumByIdService } from '../services/album.service';

export const createTrackFromAlbumController: RequestHandler = async (
  req,
  res
) => {
  try {
    const albumId = conversionToNumberService(req.body.albumId);
    const name = stringCheckService(req.body.name);
    const lyrics = stringCheckService(req.body.lyrics);
    const count = 0;
    const audio = selectFileFromRecivedFilesService(req.files, 'audio');

    if (!albumId || !name || !lyrics || !audio) {
      return res
        .status(400)
        .json({ message: 'Некорректные данные для создания трека' });
    }

    const albumById = await getAlbumByIdService(albumId);

    if (!albumById) {
      return res
        .status(404)
        .json({ message: 'Альбома в который добавляется трек - несуществует' });
    }

    const audioUrl = (await saveAudioToDirAndReturnUrlService(
      audio,
      albumById.name,
      name
    )) as string;

    const createdTrackFromAlbum = await createTrackFromAlbumService(
      albumId,
      name,
      lyrics,
      count,
      audioUrl
    );

    return res
      .status(201)
      .json({ message: 'Трек успешно добавлен', data: createdTrackFromAlbum });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getAllTracksFromAlbumByAlbumIdController: RequestHandler = async (
  req,
  res
) => {
  try {
    const albumId = conversionToNumberService(req.params.albumId);
    if (!albumId) {
      return res.status(400).json({ message: 'Передан неверный параметр' });
    }

    const allTrackFromAlbum = await getAllTracksFromAlbumByAlbumIdService(albumId);

    // Нужна ли здесь проверка на существование альбома и треков? Наверно да.
    // Оставлю до лучших времен.

    return res.status(200).json({message: 'Все треки с альбома успешно получены', data: allTrackFromAlbum});
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};
