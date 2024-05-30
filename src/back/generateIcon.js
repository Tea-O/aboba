const identicon = require('identicon')
const fs = require('fs')
const { v4 } = require('uuid');
require('dotenv').config();
const { uploadFileToS3 } = require('./s3/upload.js')
const bucketName = "team4";
const key = `cat_${Math.random()}.jpg`;

const getIcon = async() => {
    const buffer = identicon.generateSync({ id: v4(), size: 40 })

    await uploadFileToS3(bucketName, key, buffer);
    return `https://storage.yandexcloud.net/${bucketName}/${key}`
}

exports.getIcon = getIcon;