import { QueryResult } from 'pg';
import { client } from '../db';
import { Genre } from '../types';

export const isExistGenreService = async (
  name: string
): Promise<boolean | undefined> => {
  const text = 'SELECT * FROM Genre WHERE name = $1';
  const values = [name];
  try {
    const result = (await client.query(text, values)) as QueryResult<Genre>;
    if (result.rows.length > 0) return true;
    return false;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось проверить существование жанра');
    }
  }
};

export const createGenreService = async (
  name: string,
  description: string
): Promise<Genre | undefined> => {
  const text =
    'INSERT INTO Genre(name, description) VALUES($1, $2) RETURNING *';
  const values = [name, description];
  try {
    const result = (await client.query(text, values)) as QueryResult<Genre>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Ошибка при создании жанра');
    }
  }
};

export const getAllGenresService = async (): Promise<Genre[] | undefined> => {
  const text = 'SELECT * FROM Genre';
  try {
    const result = (await client.query(text)) as QueryResult<Genre>;
    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить жанры');
    }
  }
};

export const getGenreByIdService = async (id: number) => {
  const text = 'SELECT * FROM Genre WHERE id = $1';
  const values = [id];
  try {
    const result = (await client.query(text, values)) as QueryResult<Genre>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить жанр по id');
    }
  }
};

export const updateGenreByIdService = async (
  id: number,
  newName: string,
  newDescription: string
): Promise<Genre | undefined> => {
  const text =
    'UPDATE Genre SET name = $2, description = $3 WHERE id = $1 RETURNING *';
  const values = [id, newName, newDescription];
  try {
    const result = (await client.query(text, values)) as QueryResult<Genre>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось обновить жанр');
    };
  }
};

export const deleteGenreByIdService = async (id: number) => {
  const text = 'DELETE FROM Genre WHERE id = $1 RETURNING *';
  const values = [id];
  try {
    const result = (await client.query(text, values)) as QueryResult<Genre>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось удалить жанр');
    }
  }
};
