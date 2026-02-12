# FILM!

## Установка локально

### PostgreSQL
Вам требуется установить СУБД PostgreSQL и запустить её. Подключившись от лица супер-пользователя postgres создайте отдельного пользователя и базу для таблиц проекта. 
Вы можете использовать заготовки запросов для заполнения СУБД тестовыми данными фильмов и заказов, эти запросы размещены в репозитории по ссылке.
backend/test/prac.init.sql — создаёт БД и таблицы
backend/test/prac.films.sql — заполняет таблицу фильмами
backend/test/prac.shedules.sql — заполняет таблицу расписанием сеансов
### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd ./backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`.

Запустите бэкенд:

`npm run start:dev`



### Фронтенд
Перейдите в папку с исходным кодом фронтенд

`cd ./frontend`

Создайте `.env` файл из примера `.env.example`

Установите зависимости

`npm ci`

Запустите фронтенд:

`npm run dev`

### Логирование 
Для выбора формата логирования в файле `./backend/.env` для LOG_FORMAT небходимо указать один из трех фоматов:
`LOG_FORMAT=json` - JsonLogger
`LOG_FORMAT=tskv` - TSKVLogger
`LOG_FORMAT=dev` - DevLogger (по умолчанию)

### Тестирование бэкенда
Перейдите в папку с исходным кодом бэкенда

`cd ./backend`

Запуск тестов:
`npm run test`

### Docker   

./frontend/Dockerfile - для сборки фронтенда
./backend/Dockerfile - для сборки и запуска бэкенда
./nginx - файл конфигурации и Dockerfile чтобы запускать сервер, раздавать собранный фронтенд с volume и проксировать запросы /api/ и /content/ в бэкенд.
./docker-compose.yml -контейнер с PostgreSQL и pgAdmin для работы с БД

Сборка Docker:
docker compose up -d --build

Через PGAdmin (http://localhost:8080/) авторизуйтесь, используя (email, password из ./backend/.env pgadmin). 
Приложение доступно на http://localhost/     

### Ссылка на задеплоенное проект
http://films.nadya.nomorepartiessbs.ru/