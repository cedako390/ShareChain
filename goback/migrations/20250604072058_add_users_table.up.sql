-- 1. Таблица пользователей и ролей
CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    name          VARCHAR(255) NOT NULL DEFAULT 'user',
    password_hash TEXT         NOT NULL,
    role          VARCHAR(10)  NOT NULL CHECK (role IN ('admin', 'user')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2. Общая таблица папок (folders) — для личного и общего пространства
CREATE TABLE folders
(
    id         SERIAL PRIMARY KEY,
    name       TEXT        NOT NULL,               -- имя папки, напр. 'Директор' или 'отчеты'
    parent_id  INTEGER REFERENCES folders (id) ON DELETE CASCADE,
    owner_id   INTEGER REFERENCES users (id),      -- если owner_id NOT NULL => личная папка этого пользователя
    is_common  BOOLEAN     NOT NULL DEFAULT FALSE, -- true = общая папка, false = личная
    created_by INTEGER     NOT NULL REFERENCES users (id),
    -- кто создал (для общей — обязательно админ)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ограничение: если is_common = FALSE, то owner_id не может быть NULL
    CONSTRAINT chk_owner
        CHECK (
            (is_common = FALSE AND owner_id IS NOT NULL)
                OR
            (is_common = TRUE AND owner_id IS NULL)
            )
);

-- 3. Таблица «белых списков» для общего пространства
--    Каждая строка означает: user_id может изменять (write) в папке folder_id и всех её потомках.
CREATE TABLE folder_whitelist
(
    id        SERIAL PRIMARY KEY,
    folder_id INTEGER NOT NULL REFERENCES folders (id) ON DELETE CASCADE,
    user_id   INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (folder_id, user_id)
);

-- 4. Таблица файлов
--    Каждый файл лежит в какой-то папке. Поле storage_key = ключ объекта в MinIO.
CREATE TABLE files
(
    id          SERIAL PRIMARY KEY,
    folder_id   INTEGER     NOT NULL REFERENCES folders (id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,           -- название файла, напр. 'report.pdf'
    storage_key TEXT        NOT NULL,           -- ключ (object key) в MinIO, где хранится файл
    size_bytes  BIGINT      NOT NULL DEFAULT 0, -- размер в байтах (опционально)
    owner_id    INTEGER     NOT NULL REFERENCES users (id),
    -- кто загрузил/создал файл
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Таблица «закрепов» (pinned_folders): связи пользователь ↔ папка
CREATE TABLE pinned_folders
(
    id        SERIAL PRIMARY KEY,
    user_id   INTEGER NOT NULL REFERENCES users  (id) ON DELETE CASCADE,
    folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    UNIQUE (user_id, folder_id)
);


-- Индекс для быстрого поиска файлов по ключу и папке
CREATE INDEX idx_files_folder ON files (folder_id);
CREATE INDEX idx_files_storage_key ON files (storage_key);

