import { QueryResult } from 'pg';
import { client } from '../db';
import { TrackFromAlbum } from '../types';

export const createTrackFromAlbumService = async (
  albumId: number,
  name: string,
  lyrics: string,
  count: number,
  audio: string
) => {
  try {
    const text = 'INSERT INTO TrackFromAlbum(album_id, name, lyrics, count, audio) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [albumId, name, lyrics, count, audio];

    const result = (await client.query(
      text,
      values
    )) as QueryResult<TrackFromAlbum>;
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Ну удалось добавить трек в альбом');
    };
  }
};

export const getAllTracksFromAlbumByAlbumIdService = async (albumId: number) => {
  try {
    const text = 'SELECT * FROM TrackFromAlbum WHERE album_id = $1 ORDER BY name';
    const values = [albumId];

    const result = await client.query(text, values) as QueryResult<TrackFromAlbum>;
    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Не удалось получить треки из альбома');
    };
  }
}
