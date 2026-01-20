-- Создаём базу данных 
    CREATE DATABASE film_project;
    CREATE USER user_adm WITH PASSWORD '123456';
    GRANT ALL PRIVILEGES ON DATABASE film_project TO user_adm;

-- Подключаемся к базе 
 \c nest_project


-- Создаём таблицу film
CREATE TABLE IF NOT EXISTS film (
    id VARCHAR PRIMARY KEY,
    rating NUMERIC NOT NULL CHECK (rating >= 0 AND rating <= 10),
    director VARCHAR NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',  -- массив строк (tags)
    image VARCHAR NOT NULL,
    cover VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    about TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Создаём таблицу schedule с внешним ключом к film
CREATE TABLE IF NOT EXISTS schedule (
    id VARCHAR PRIMARY KEY,
    daytime TIMESTAMP WITH TIME ZONE NOT NULL, 
    hall INTEGER NOT NULL CHECK (hall >= 0),
    rows INTEGER NOT NULL CHECK (rows >= 0),
    seats INTEGER NOT NULL CHECK (seats >= 0),
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),  -- положительная цена
    taken TEXT[] NOT NULL DEFAULT '{}',
    film_id VARCHAR(255) NOT NULL,

    -- Внешний ключ: один фильм — много сеансов
    CONSTRAINT fk_schedule_film
        FOREIGN KEY (film_id)
        REFERENCES film(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

GRANT CONNECT ON DATABASE film_project TO user_adm;


-- Права на таблицы
GRANT ALL ON TABLE film TO user_adm;
GRANT ALL ON TABLE schedule TO user_adm;

-- Индексы для ускорения запросов 
CREATE INDEX IF NOT EXISTS idx_schedule_film_id ON schedule(film_id);
CREATE INDEX IF NOT EXISTS idx_schedule_daytime ON schedule(daytime);
