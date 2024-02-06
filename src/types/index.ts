export type Genre = {
  id: number;
  name: string;
  description: string;
};

export type Artist = {
  id: number;
  name: string;
  date_of_creation: string;
  date_of_complition: string;
  image: string;
  description: string;
}

export type Album = {
  id: number;
  artist_id: number;
  name: string;
  date_of_creation: string;
  image: string;
  description: string;
  genre_id: number;
};

export type Track = {
  id: number
  album_id: number;
  name: string;
  lyrics: string;
  count: number;
  audio: string;
}

export type TrackFromAlbum = {
  id: number;
  album_id: number;
  name: string;
  text: string;
  count: number;
  audio: string;
};