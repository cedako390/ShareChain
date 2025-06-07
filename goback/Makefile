# Makefile
# -----------------------
# Переменные:
#
# DATABASE_URL: строка подключения к БД (Postgres)
#   Пример: postgres://user:pass@localhost:5432/dbname?sslmode=disable
#
# MIGRATE: путь к бинарю migrate (если в PATH — оставьте пустым)
#   Пример: /home/user/go/bin/migrate
#
# MIGRATIONS_DIR: папка с миграциями
#   Обычно: migrations
#
# Чтобы создать новую миграцию, указывайте NAME, напр.:
#   make create-migration NAME=add_users_table
#
# Чтобы сделать up/down:
#   make migrate-up
#   make migrate-down
#
# -----------------------

DATABASE_URL ?= postgres://myuser:mypassword@localhost:5432/mydatabase?sslmode=disable
MIGRATE      ?= migrate
MIGRATIONS_DIR := migrations

.PHONY: migrate-up migrate-down create-migration

# Выполнить все миграции вперёд
migrate-up:
	@echo "==> apply up migrations"
	$(MIGRATE) -path $(MIGRATIONS_DIR) -database "$(DATABASE_URL)" up

# Откатить последнюю миграцию (или несколько через count=X: down X)
migrate-down:
	@echo "==> apply down (rollback)"
	$(MIGRATE) -path $(MIGRATIONS_DIR) -database "$(DATABASE_URL)" down

# Создать новую пару миграционных файлов: .up.sql и .down.sql
# Пример: make create-migration NAME=create_orders_table
create-migration:
ifndef NAME
	$(error NAME is not set. Usage: make create-migration NAME=<migration_name>)
endif
	@echo "==> creating new migration: $(NAME)"
	$(MIGRATE) create -ext sql -dir $(MIGRATIONS_DIR) $(NAME)
	@echo "Created files:"
	@ls -1 $(MIGRATIONS_DIR)/*$(NAME)*.sql

