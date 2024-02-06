import { RequestHandler } from 'express';
import { conversionToNumberService } from '../services/number.service';
import { stringCheckService } from '../services/string.service';
import {
  deleteFileService,
  saveTrackAndReturnUrlService,
  selectFileFromRecivedFilesService,
} from '../services/file.service';
import {
  addTrackService,
  deleteTrackByIdService,
  getAllTracksService,
  getTrackByIdService,
  updateTrackByIdService,
} from '../services/track.service';
import { getAlbumByIdService } from '../services/album.service';
import { getArtistByIdService } from '../services/artist.service';

export const addTrackController: RequestHandler = async (req, res) => {
  try {
    const albumId = conversionToNumberService(req.body.albumId);
    const name = stringCheckService(req.body.name);
    const lyrics = stringCheckService(req.body.lyrics);
    const count = 0;
    const audioFile = selectFileFromRecivedFilesService(req.files, 'audio');

    if (!albumId || !name || !lyrics || !audioFile) {
      return res
        .status(400)
        .json({ message: 'Переданны некорректные данные для создания трека' });
    }

    const albumById = await getAlbumByIdService(albumId);

    if (!albumById) {
      return res
        .status(404)
        .json({ message: 'Альбома с указанным id - не существует' });
    }

    // Решить вот это херню. А именно куда сохранять трек
    const artistById = await getArtistByIdService(albumById.artist_id);

    if (!artistById) {
      return res.status(400).json({
        message: 'Артиста по указанному треку не существует. Impossible',
      });
    }

    const { name: artistName } = artistById;

    const audioUrl = await saveTrackAndReturnUrlService(
      audioFile,
      artistName,
      name
    );

    if (!audioUrl) {
      return res.status(500).json({ message: 'Сюда мы должны попасть' });
    }

    const addedTrack = await addTrackService(
      albumId,
      name,
      lyrics,
      count,
      audioUrl
    );

    return res.status(200).json({
      message: `В альбом ${albumById.name}, успешно добавлен трек ${name}`,
      data: addedTrack,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getAllTracksController: RequestHandler = async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const limit =
      typeof req.query.limit === 'string'
        ? Number.parseInt(req.query.limit)
        : 10;
    const offset =
      typeof req.query.offset === 'string'
        ? Number.parseInt(req.query.offset) - 1
        : 0;

    const allTracks = await getAllTracksService(query, limit, offset);

    return res.status(200).json({
      message: 'Все треки. Данные для пагинации будут позже',
      data: allTracks,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getTrackByIdContoller: RequestHandler = async (req, res) => {
  try {
    const trackId = conversionToNumberService(req.params.trackId);
    if (!trackId) {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор для получения трека' });
    }

    const trackById = await getTrackByIdService(trackId);

    if (!trackById) {
      return res
        .status(404)
        .json({ message: 'По указанному идентификатору тректов не найдено' });
    }

    return res
      .status(200)
      .json({ message: 'Трек по id успешно получен', data: trackById });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateTrackByIdController: RequestHandler = async (req, res) => {
  try {
    const trackId = conversionToNumberService(req.params.trackId);
    if (!trackId) {
      return res
        .status(400)
        .json({
          message: 'Передан некорректный инентификатор для изменения трека',
        });
    }

    const trackById = await getTrackByIdService(trackId);
    if (!trackById) {
      return res
        .status(404)
        .json({ message: 'По переданному идентификатору трека не найдено' });
    }

    // Следующие запросы в БД нужны для получения название автора трека. Для создание красивого имени track.audio и сохранении его в бд.
    const albumByTrackId = await getAlbumByIdService(trackById.album_id);
    if (!albumByTrackId) {
      return res
        .status(400)
        .json({ message: 'Невозможная ошибка. updateTrackByIdController' });
    }
    const artistByAlbulId = await getArtistByIdService(
      albumByTrackId.artist_id
    );
    if (!artistByAlbulId) {
      return res
        .status(400)
        .json({ message: 'Невозможная ошибка. updateTrackByIdController' });
    }

    const newAlbumId =
      conversionToNumberService(req.body.albumId) || trackById.album_id;
    const newName = stringCheckService(req.body.name) || trackById.name;
    const newLyrics = stringCheckService(req.body.lyrics) || trackById.lyrics;
    const newAudioFile = selectFileFromRecivedFilesService(req.files, 'audio');

    // Уродливно... Ниже нужно переписать.
    if (newAudioFile) {
      await deleteFileService(trackById.audio);
    }

    const newAudioUrl = newAudioFile
      ? await saveTrackAndReturnUrlService(
          newAudioFile,
          artistByAlbulId.name,
          newName
        )
      : trackById.audio;

    const updatedTrack = await updateTrackByIdService(
      trackId,
      newAlbumId,
      newName,
      newLyrics,
      newAudioUrl as string
    );

    return res
      .status(200)
      .json({ message: 'Трек успешно изменен', data: updatedTrack });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteTrackByIdController: RequestHandler = async (req, res) => {
  try {
    const trackId = conversionToNumberService(req.params.trackId);
    if (!trackId) {
      return res
        .status(400)
        .json({ message: 'Некорректный идентификатор трека для удаления' });
    }

    const trackById = await getTrackByIdService(trackId);

    if (!trackById) {
      return res.status(404).json({
        message: 'Трека с указанным id не существует. Нечего удалять',
      });
    }

    const deletedTrack = await deleteTrackByIdService(trackId);

    await deleteFileService(deletedTrack?.audio as string);

    return res
      .status(200)
      .json({ message: 'Трек успешно удален', data: deletedTrack });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};
