import { QueryResult } from 'pg';
import { client } from '../db';
import { Track } from '../types';

export const addTrackService = async (albumId: number, name: string, lyrics: string, count: number, audioUrl: string) => {
 try {
  const text = 'INSERT INTO Track(album_id, name, lyrics, count, audio) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [albumId, name, lyrics, count, audioUrl];

  const result = await client.query(text, values) as QueryResult<Track>;
  return result.rows[0];
 } catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error('Не удалось добавить трек');
  };
 }
}

export const getAllTracksService = async (query: string, limit: number, offset: number) => {
  try {
    const text = "SELECT * FROM Track WHERE name ILIKE '%' || $1 || '%' LIMIT $2 OFFSET $3";
    const values = [query, limit, offset];

    const result = await client.query(text, values) as QueryResult<Track>;
    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить треки');
    };
  }
}

export const getTrackByIdService = async (trackId: number) => {
  try {
    const text = 'SELECT * FROM Track WHERE id = $1';
    const values = [trackId];

    const result = await client.query(text, values) as QueryResult<Track>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить трек по указанному идентификатору');
    };
  }
}

export const updateTrackByIdService = async (trackId: number, albumId: number, name: string, lyrics: string, audio: string) => {
  try {
    const text = 'UPDATE Track SET album_id = $2, name = $3, lyrics = $4, audio = $5 WHERE id = $1 RETURNING *';
    const values = [trackId, albumId, name, lyrics, audio];

    const result = await client.query(text, values) as QueryResult<Track>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось обновить трек');
    };
  }
}

export const deleteTrackByIdService = async (trackId: number) => {
  try {
    const text = 'DELETE FROM Track WHERE id = $1 RETURNING *';
    const values = [trackId];

    const result = await client.query(text, values) as QueryResult<Track>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось удалить трек');
    };
  }
}