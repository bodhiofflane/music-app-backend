import { RequestHandler } from 'express';
import {
  createAristService,
  deleteArtistByIdService,
  getAllArtistService,
  getArtistByIdService,
  isExsistArtistService,
  searchArtistService,
  updateArtistByIdService,
} from '../services/artist.service';
import { dateTransformService } from '../services/date.service';
import { deleteFileService, saveImageToDirAndReturnUrlService } from '../services/file.service';

export const createArtistController: RequestHandler = async (req, res) => {
  const imageFile = req.files && req.files.image && !Array.isArray(req.files.image) ? req.files.image : null;

  const name = req.body.name as string;
  const dateOfCreation = dateTransformService(req.body.dateOfCreation) as string;
  const dateOfComplition = req.body.dateOfComplition as string ? dateTransformService(req.body.dateOfComplition) : null;
  const description = req.body.description;
  const formatedName = name.split(' ').join('');

  try {
     const imageUrl = await saveImageToDirAndReturnUrlService(imageFile, 'artist', formatedName.toLocaleLowerCase()) as string;
    const responseForClient = await createAristService(name, dateOfCreation, dateOfComplition, imageUrl, description);
    res.status(201).json({message: 'Запись артиста/группы успешно создана', data: responseForClient});
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }
};

export const getAllArtistController: RequestHandler = async (req, res) => {
  const offset  = typeof req.query.offset === 'string' ? Number.parseInt(req.query.offset) - 1 : 0;
  const limit = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit) : 10;
  const query = typeof req.query.q === 'string' ? req.query.q : '';

  try {
    const responseForClient = await getAllArtistService(query, limit, offset);
    res.status(200).json({message: 'Список артистов/групп успешно получен', data: responseForClient});
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }
}

export const getArtistByIdController: RequestHandler = async (req, res) => {
  const artistId = req.params.artistId;
  try {
    const artist = await getArtistByIdService(Number.parseInt(artistId));
    if (!artist) {
      res.status(404).json({message: 'Такой артист/группа не были найдены'});
    }
    res.status(200).json({message: 'Данные об артисте/группе успешно полученны', data: artist});
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export const updateArtistController: RequestHandler = async (req, res) => {
  const artistId = req.params.artistId;

  try {
    const artist = await getArtistByIdService(Number.parseInt(artistId));

    if (!artist) {
      return res.status(404).json({message: 'Такой артист/группа не были найдены'});
    }

    const newName = req.body.name || artist.name;
    const newDateOfCreation = req.body.dateOfCreation || artist.date_of_creation;
    const newDateOfComplition = req.body.dateOfComplition || artist.date_of_complition;

    const newImageFile =
      req.files && req.files.image && !Array.isArray(req.files.image)
        ? await saveImageToDirAndReturnUrlService(
            req.files.image,
            'artist',
            newName
          ) as string
        : artist.image as string;
    const newDescription = req.body.description || artist.description;

    const updatedArtist = await updateArtistByIdService(
      Number.parseInt(artistId),
      newName,
      newDateOfCreation,
      newDateOfComplition,
      newImageFile,
      newDescription
    );

    res.status(201).json({message: 'Запись артеста/группы обновленна', date: updatedArtist});

  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }
}

export const deleteArtistController: RequestHandler = async (req, res) => {
  const artistId = req.params.artistId;
  try {
    const artist = await getArtistByIdService(Number.parseInt(artistId));

    if (!artist) {
      return res.status(404).json({message: 'Такой артист/группа не были найдены'});
    }

    const deletedArtist = await deleteArtistByIdService(Number.parseInt(artistId));
    await deleteFileService(artist.image as string);

    res.status(200).json({message: 'Артист/группа успешно удален', data: deletedArtist});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
  }
}

export const searhArtistController: RequestHandler = async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : null;

    if (!query) {
      return res.status(400).json({message: 'Что-то не так со сторой запроса'})
    }

    const artists = await searchArtistService(query);
    res.status(200).json({message: 'Результат по запросу артиса/группы', data: artists});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
    }
  }
}