# Переменные среды для запуска
```
# В cura используется postgres, поэтому url базы данных собирается внутри кода
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
# Тут должно быть название сервиса базы данных, которое указано в docker compose
DB_HOST=db
# Пароль для шифрования куки сессии длинной 32 символа
NUXT_SESSION_PASSWORD=
# Информация о redis, для dev нужно полжить это в file-assembler/.env 
REDIS_PASSWORD=
REDIS_USER=
REDIS_USER_PASSWORD=
```