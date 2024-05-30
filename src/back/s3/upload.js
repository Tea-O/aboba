const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('node:fs');

// Создаем экземпляр клиента S3
const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadFileToS3(bucketName, key, fileData) {
    // Подготавливаем параметры для загрузки файла
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fileData,
    };

    try {
        // Выполняем команду загрузки объекта в S3
        const uploadCommand = new PutObjectCommand(uploadParams);
        const result = await s3Client.send(uploadCommand);
        console.log("Файл успешно загружен в S3:", result);

        return result;
    } catch (error) {
        console.error("Ошибка при загрузке файла в S3:", error);

        throw error;
    }
}

// Пример использования
const bucketName = "team4"; // Укажите имя вашего бакета
const key = `cat_${Math.random()}.jpg`; // Укажите ключ (путь) к файлу в S3
const fileData = fs.readFileSync('./cat.jpg'); // Файл

module.exports = uploadFileToS3;
