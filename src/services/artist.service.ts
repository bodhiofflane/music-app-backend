import { QueryResult } from 'pg';
import { client } from '../db';
import { Artist } from '../types';

export const isExsistArtistService = async (name: string) => {
  const text = 'SELECT * FROM Artist AS a WHERE a.name = $1';
  const values = [name];
  const res = await client.query(text, values);
  return res.rows;
};

export const createAristService = async (
  name: string,
  dateOfCreation: string,
  dateOfComplition: string | null,
  image: string,
  description: string
) => {
  const text =
    'INSERT INTO Artist(name, date_of_creation, date_of_complition, image, description) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const valuse = [name, dateOfCreation, dateOfComplition, image, description];
  try {
    const response = await client.query(text, valuse);
    return response.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Ошибка при создании артиста');
    }
  }
};

export const getAllArtistService = async (query: string, limit: number, offset: number) => {
  try {
    const text = "SELECT * FROM Artist WHERE name ILIKE '%' || $1 || '%' LIMIT $2 OFFSET $3";
    const values = [query, limit, offset];
    console.log(query, limit, offset);

    const response = await client.query(text, values);
    return response.rows;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Не удалость получить список артистом/групп');
    }
  }
};

export const getArtistByIdService = async (id: number) => {
  const text = 'SELECT * FROM Artist WHERE id = $1';
  const values = [id];
  try {
    const response = await client.query(text, values) as QueryResult<Artist>;
    return response.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Ошибка получения артиста/группы');
    }
  }
};

export const updateArtistByIdService = async (
  id: number,
  newName: string,
  newDateOfCreation: string,
  newDateOfComplition: string | null,
  newImage: string,
  newDescription: string
) => {
  const text =
    'UPDATE Artist SET name = $2, date_of_creation = $3, date_of_complition = $4, image = $5, description = $6 WHERE id = $1 RETURNING *';
  const values = [
    id,
    newName,
    newDateOfCreation,
    newDateOfComplition,
    newImage,
    newDescription,
  ];
  try {
    const updatedArtist = await client.query(text, values);
    return updatedArtist.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error('Ошибка во время обновления данных артиста/группы');
    }
  }
};

export const deleteArtistByIdService = async (artistId: number) => {
  const text = 'DELETE FROM Artist WHERE id = $1 RETURNING *';
  const values = [artistId];
  try {
    const deletedArtist = await client.query(text, values);
    return deletedArtist.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Ну удалось удалить артиста/группу');
    }
  }
};

export const searchArtistService = async (query: string) => {
  const text = "SELECT * FROM Artist WHERE name ILIKE '%' || $1 || '%'";
  const values = [query];
  try {
    const artists = await client.query(text, values);
    console.log(artists.rows);
    return artists.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось найти артиста/группу');
    }
  }
};
