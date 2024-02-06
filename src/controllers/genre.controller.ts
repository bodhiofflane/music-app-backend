import { RequestHandler } from 'express';
import {
  createGenreService,
  deleteGenreByIdService,
  getAllGenresService,
  getGenreByIdService,
  isExistGenreService,
  updateGenreByIdService,
} from '../services/genre.service';
import { conversionToNumberService } from '../services/number.service';

export const createGenreController: RequestHandler = async (req, res) => {
  const name = req.body.name as string;
  const description = req.body.description as string;

  try {
    if (await isExistGenreService(name)) {
      return res.status(400).json({ message: 'Такой жанр уже существует' });
    }
    const createdGenre = await createGenreService(name, description);
    return res
      .status(201)
      .json({ message: 'Жанр успешно создан', data: createdGenre });
  } catch (error) {
    if (error instanceof Error) {
      // Возможно логи нужно убрать и оставить только в сервисах
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getAllGenresController: RequestHandler = async (req, res) => {
  try {
    const allGenres = await getAllGenresService();
    // Массив может быть пустым и все будет ок. Или сделать проверку? Или сделать проверку на фронте?
    return res
      .status(200)
      .json({ message: 'Жанры успешно получены', data: allGenres });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getGenreByIdController: RequestHandler = async (req, res) => {
  const id = conversionToNumberService(req.params.genreId);
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Передан неверный параметр для получения жанра' });
  }
  try {
    const genreById = await getGenreByIdService(id);
    if (!genreById) {
      return res
        .status(404)
        .json({ message: 'По запрашиваемому id жанра не найдено' });
    }
    return res
      .status(200)
      .json({ message: 'Жанр успешно получен', data: genreById });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateGenreByIdController: RequestHandler = async (req, res) => {
  const id = conversionToNumberService(req.params.genreId);
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Передан неверный параметр для обновления жанра' });
  }
  try {
    const genreById = await getGenreByIdService(id);
    if (!genreById) {
      return res
        .status(404)
        .json({ message: 'Жанра по запрошенному id несуществует' });
    }

    const newName =
      req.body.name && typeof req.body.name === 'string'
        ? (req.body.name as string)
        : genreById.name;
    const newDescription =
      req.body.description && typeof req.body.description === 'string'
        ? (req.body.description as string)
        : genreById.description;

    const updatedGenre = await updateGenreByIdService(
      id,
      newName,
      newDescription
    );
    return res
      .status(200)
      .json({ message: 'Жанр успешно изменен', data: updatedGenre });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteGenreByIdController: RequestHandler = async (req, res) => {
  const id = conversionToNumberService(req.params.genreId);
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Передан неверный параметр для удаления жанра' });
  }
  try {
    const genreById = await getGenreByIdService(id);

    if (!genreById) {
      return res.status(404).json({ message: 'Ресурс для уданения не найден' });
    }

    const deletedGenre = await deleteGenreByIdService(id);
    return res
      .status(200)
      .json({ message: 'Жанр успешно удален', data: deletedGenre });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};
