CREATE TABLE Genre(
  id SERIAL PRIMARY KEY,
  name varchar(128) NOT NULL,
  description text NOT NULL
);

/* \dt */
/* \d Genre */

-- Проверка существования жанра
SELECT * FROM Genre
WHERE name = $1;

-- Создание жанра
INSERT INTO Genre(name, description)
VALUES($1, $2) RETURNING *;

-- Получить все жанры
SELECT * FROM Genre;

-- Получение жанра по id
SELECT * FROM Genre
WHERE id = $1

-- Обновление жанра
UPDATE Genre
SET name = $2, description = $3
WHERE id = $1
RETURNING *;

-- Удаление жанра
DELETE FROM Genre
WHERE id = $1 RETURNING *;