CREATE TABLE Track(
  id SERIAL PRIMARY KEY,
  album_id INT REFERENCES Album(id),
  name varchar(128) NOT NULL UNIQUE,
  lyrics text NOT NULL,
  count INT NOT NULL,
  audio text NOT NULL
);

/* \dt
  \t Track */

-- Создание трека.
INSERT INTO Track(album_id, name, lyrics, count, audio)
VALUES($1, $2, $3, $4, $5)
RETURNING *;

-- Получение всех треков
SELECT *
FROM Track
WHERE name ILIKE '%' || $1 || '%'
LIMIT $2
OFFSET $3;

-- Получение трека по идентификатору
SELECT *
FROM Track
WHERE id = $1;

-- Обновление трека по идентификатору
UPDATE Track
SET album_id = $2, name = $3, lyrics = $4, audio = $5
WHERE id = $1
RETURNING *;

-- Удаление трека по идентификатору
DELETE FROM Track
WHERE id = $1
RETURNING *;

