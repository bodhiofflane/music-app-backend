CREATE TABLE Artist(
  id SERIAL PRIMARY KEY,
  name varchar(128) UNIQUE NOT NULL,
  date_of_creation DATE NOT NULL,
  date_of_complition DATE,
  image text NOT NULL,
  description text NOT NULL
);

/* \dt */
/* \d Artist */


-- Проверка на существования артиста
SELECT *
FROM Artist AS a
WHERE a.name = 1$;

-- Создание артиста
INSERT INTO Artist(name, date_of_creation, date_of_complition, image, description)
VALUES($1, $2, $3, $4, $5) RETURNING *;

-- Получение всех артистов
SELECT * FROM Artist WHERE name ILIKE '%' || $1 || '%' LIMIT $2 OFFSET $3;

-- Получение артиста по id
SELECT * FROM Artist
WHERE id = $1;

-- Обновление артиста
UPDATE Artist
SET name = $2, date_of_creation = $3, date_of_complition = $4, image = $5, description = $6
WHERE id = $1
RETURNING *;

-- Удаление артиста
DELETE FROM Artist WHERE id = $1 RETURNING *;

-- Поиск артиста
SELECT * FROM Artist WHERE name ILIKE '%' || $1 || '%';