import { RequestHandler } from 'express';
import {
  spaceRemovalService,
  stringCheckService,
} from '../services/string.service';
import { dateTransformService } from '../services/date.service';
import {
  deleteFileService,
  saveImageToDirAndReturnUrlService,
  selectFileFromRecivedFilesService,
} from '../services/file.service';
import { conversionToNumberService } from '../services/number.service';
import {
  createAlbumService,
  deleteAlbumByIdService,
  getAlbumByIdService,
  getAllAlbumsService,
  updateAlbumByIdService,
} from '../services/album.service';

export const createAlbumController: RequestHandler = async (req, res) => {
  const artistId = conversionToNumberService(req.body.artistId);
  const name = stringCheckService(req.body.name);
  const dateOfCreation = dateTransformService(req.body.dateOfCreation);
  const image = selectFileFromRecivedFilesService(req.files, 'image'); // Поле Form Data должно называться 'image'.
  const description = stringCheckService(req.body.description);
  const genreId = conversionToNumberService(req.body.genreId);

  if (
    !artistId ||
    !name ||
    !dateOfCreation ||
    !image ||
    !description ||
    !genreId
  ) {
    return res
      .status(400)
      .json({ message: 'Некорректные данные для создания альбома' });
  }

  const nameForImage = spaceRemovalService(name);

  try {
    const imageUrl = (await saveImageToDirAndReturnUrlService(
      image,
      'album',
      nameForImage
    )) as string;
    const createdAlbum = await createAlbumService(
      artistId,
      name,
      dateOfCreation,
      imageUrl,
      description,
      genreId
    );
    return res
      .status(201)
      .json({ message: 'Альбом успешно создан', data: createdAlbum });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getAllAlbumsController: RequestHandler = async (req, res) => {
  try {
    const offset =
      typeof req.query.offset === 'string'
        ? Number.parseInt(req.query.offset) - 1
        : 0;
    const limit =
      typeof req.query.limit === 'string'
        ? Number.parseInt(req.query.limit)
        : 10;
    const query = typeof req.query.q === 'string' ? req.query.q : '';

    const allAlmubs = await getAllAlbumsService(query, limit, offset);
    return res
      .status(200)
      .json({ message: 'Альбомы успешно получены', data: allAlmubs });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getAlbumByIdController: RequestHandler = async (req, res) => {
  const albumId = conversionToNumberService(req.params.albumId);
  if (!albumId) {
    return res
      .status(400)
      .json({ message: 'Некорректный параметр для поиска альбома' });
  }
  try {
    const albumById = await getAlbumByIdService(albumId);
    if (!albumById) {
      return res
        .status(404)
        .json({ message: 'Альбома с указанным id не существует' });
    }
    return res
      .status(200)
      .json({ message: 'Альбом по указанному id получен', data: albumById });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateAlbumByIdController: RequestHandler = async (req, res) => {
  try {
    const albumId = conversionToNumberService(req.params.albumId);
    if (!albumId) {
      return res
        .status(400)
        .json({ message: 'Некорректный параметр для изменения альбома' });
    }

    const albumById = await getAlbumByIdService(albumId);

    if (!albumById) {
      return res
        .status(404)
        .json({ message: 'Альбома с указанным id не существует' });
    }

    const newName = req.body.name || albumById.name;
    const newArtistId = req.body.artistId || albumById.artist_id;
    const newDateOfCreation =
      req.body.dateOfCreation || albumById.date_of_creation;
    const newImageUrl = selectFileFromRecivedFilesService(req.files, 'image')
      ? ((await saveImageToDirAndReturnUrlService(
          selectFileFromRecivedFilesService(req.files, 'image'),
          'artist',
          newName
        )) as string)
      : albumById.image;
    const newDescription = req.body.description || albumById.description;
    const newGenreId = req.body.genreId || albumById.genre_id;

    const updatedAlbum = await updateAlbumByIdService(
      albumId,
      newName,
      newArtistId,
      newDateOfCreation,
      newImageUrl,
      newDescription,
      newGenreId
    );
    // Удалить старое изображение... Разберись...
    return res
      .status(200)
      .json({
        message: 'Данные о альбоме успешно изменены',
        date: updatedAlbum,
      });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteAlbumByIdController: RequestHandler = async (req, res) => {
  try {
    const albumId = conversionToNumberService(req.params.albumId);
    if (!albumId) {
      return res
        .status(400)
        .json({ message: 'Некорректный параметр для удаления' });
    }

    const albumById = await getAlbumByIdService(albumId);

    if (!albumById) {
      return res
        .status(404)
        .json({ message: 'Альбома с указанным id не существует' });
    }

    const deletedAlbum = await deleteAlbumByIdService(albumId);

    await deleteFileService(albumById.image);

    return res
      .status(200)
      .json({ message: 'Альбом удален', date: deletedAlbum });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};
