-- backend/migrations/20250608120000_add_common_space_tables.up.sql

-- Добавляем флаг is_common в таблицу folders, если его еще нет
ALTER TABLE folders ADD COLUMN IF NOT EXISTS is_common BOOLEAN NOT NULL DEFAULT FALSE;

-- Таблица для белого списка пользователей, имеющих право на запись в общие папки
CREATE TABLE IF NOT EXISTS folder_whitelist (
                                                id SERIAL PRIMARY KEY,
                                                folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (folder_id, user_id)
    );