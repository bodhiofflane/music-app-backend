CREATE Table Album(
  id SERIAL PRIMARY KEY,
  artist_id INT REFERENCES Artist(id),
  name varchar(128) NOT NULL,
  date_of_creation DATE NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  genre_id INT REFERENCES Genre(id)
);

/* \dt */
/* \d Album */

-- Создание альбома
INSERT INTO Album(artist_id, name, date_of_creation, image, description, genre_id)
VALUES($1, $2, $3, $4, $5, $6);

-- Получение всех альбомов
SELECT * FROM Album
WHERE name ILIKE '%' || $1 || '%'
LIMIT $2
OFFSET $3;

-- Получение альбома по id
SELECT * FROM Album WHERE id = $1;

-- Обновление альбома
UPDATE Album
SET name=$2, artist_id=$3, date_of_creation=$4, image=$5, description=$6, genre_id=$7
WHERE id=$1
RETURNING *;

-- Удаление альбома
DELETE FROM Album
WHERE id=$1;