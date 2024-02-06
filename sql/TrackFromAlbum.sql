
CREATE TABLE TrackFromAlbum(
  id SERIAL PRIMARY KEY,
  album_id INT REFERENCES Album(id),
  name varchar(128) NOT NULL UNIQUE,
  lyrics text NOT NULL,
  count INT NOT NULL,
  audio text NOT NULL
);

/* \dt */
/* \d TrackFromAlbum */

-- ALTER TABLE TrackFromAlbum
-- DROP COLUMN name;

-- ALTER TABLE TrackFromAlbum
-- ADD COLUMN name varchar(128) NOT NULL UNIQUE;

-- ALTER TABLE TrackFromAlbum
-- RENAME COLUMN text TO lyrics;

-- Создание трека
INSERT INTO TrackFromAlbum(album_id, name, text, count, audio)
VALUES($1, $2, $3, $4, $5)
RETURNING *;

-- Получение всех треков с альбома по id альбома
SELECT * FROM TrackFromAlbum
WHERE album_id = $1
ORDER BY name;

-- Удаляю за ненадобностью
DROP TABLE TrackFromAlbum
