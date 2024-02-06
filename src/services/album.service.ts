import { QueryResult } from 'pg';
import { client } from '../db';
import { Album } from '../types';

export const createAlbumService = async (
  artistId: number,
  name: string,
  dateOfCreation: string,
  image: string,
  description: string,
  genreId: number
) => {
  const text =
    'INSERT INTO Album(artist_id, name, date_of_creation, image, description, genre_id) VALUES($1, $2, $3, $4, $5, $6) RETUNRNING *';
  const values = [artistId, name, dateOfCreation, image, description, genreId];
  try {
    const result = (await client.query(text, values)) as QueryResult<Album>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Ошибка при созданиии альбома');
    }
  }
};

export const getAllAlbumsService = async (
  query: string,
  limit: number,
  offset: number
) => {
  const text =
    "SELECT * FROM Album WHERE name ILIKE '%' || $1 || '%' LIMIT $2 OFFSET $3";
  const values = [query, limit, offset];
  try {
    const result = (await client.query(text, values)) as QueryResult<Album>;
    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить альбомы');
    }
  }
};

export const getAlbumByIdService = async (albumId: number) => {
  const text = 'SELECT * FROM Album WHERE id = $1';
  const values = [albumId];

  try {
    const result = (await client.query(text, values)) as QueryResult<Album>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить альбом по id');
    }
  }
};

export const updateAlbumByIdService = async (
  albumId: number,
  name: string,
  artistId: number,
  dateOfCreation: string,
  image: string,
  description: string,
  genreId: number
) => {
  try {
    const text =
      'UPDATE Album SET name=$2, artist_id=$3, date_of_creation=$4, image=$5, description=$6, genre_id=$7 WHERE id=$1 RETURNING *';
    const values = [albumId, name, artistId, dateOfCreation, image, description, genreId];
    
    const result = (await client.query(text, values)) as QueryResult<Album>;
    return result.rows[0];
  } catch (error) {}
};

export const deleteAlbumByIdService = async (albumId: number) => {
  try {
    const text = 'DELETE FROM Album WHERE id=$1';
    const values = [albumId];

    const result = await client.query(text, values) as QueryResult<Album>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось удалить альбом');
    };
  }
}