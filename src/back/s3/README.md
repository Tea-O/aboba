# Пример выгрузки файла в хранилище S3

1. Устанавливаем зависимости `npm i`

2. Запускаем скрипт с указанием переменных окружений:
```
AWS_ACCESS_KEY_ID=X AWS_SECRET_ACCESS_KEY=Y node upload
```

где `AWS_ACCESS_KEY_ID` и `AWS_SECRET_ACCESS_KEY` секреты от хранилища (будут выданы каждой команде)