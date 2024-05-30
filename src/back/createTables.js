// import sqlite from 'sqlite'
// import { open } from 'sqlite'
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

(async () => {
  const db = await open({
    filename: './database/database.db',
    driver: sqlite3.cached.Database
  })
  await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login varchar(255) NOT NULL,
    password varchar(255),
    icon varchar(2083)
    )
  `)
  await db.exec('INSERT INTO users VALUES (null, "test1", "test1", "test1")')
  let a = await db.all('SELECT * FROM users');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(255) NOT NULL,
    icon varchar(2083)
    )
  `)
  await db.exec('INSERT INTO chats VALUES (null, "test2", "test2")')
  a = await db.all('SELECT * FROM chats');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId int NOT NULL,
    userId int NOT NULL,
    createdAt DATE NOT NULL,
    updatedAt DATE NOT NULL,
    message varchar(2083)                         
    )
  `)
  await db.exec(`INSERT INTO messages VALUES (null, 0, 0, ${Date.now()}, ${Date.now()}, "Hello!")`)
  a = await db.all('SELECT * FROM messages');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS chatsToUsers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idChat int NOT NULL,
    idUser int NOT NULL,
    FOREIGN KEY (idChat) REFERENCES chats(id),
    FOREIGN KEY (idUser) REFERENCES users(id)                                      
    )
  `)
  await db.exec('INSERT INTO chatsToUsers VALUES (null, 0, 0)')
  a = await db.all('SELECT * FROM chatsToUsers');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS usersToChats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUser int NOT NULL,
    idChat int NOT NULL,
    FOREIGN KEY (idChat) REFERENCES chats(id),
    FOREIGN KEY (idUser) REFERENCES users(id)                                      
    )
  `)
  await db.exec('INSERT INTO usersToChats VALUES (null, 1, 2)')
  await db.exec('INSERT INTO usersToChats VALUES (null, 1, 3)')
  await db.exec('INSERT INTO usersToChats VALUES (null, 0, 3)')
  a = await db.all('SELECT * FROM usersToChats');
  console.log(a);
  const zero = 0;
  // a = await db.all('SELECT * FROM usersToChats WHERE idUser = ?', [zero]);
  // console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageName VARCHAR(255) NOT NULL,
    imageData BLOB NOT NULL
  )
  `)
  await db.exec('INSERT INTO images VALUES (null, 0, 0)')
  a = await db.all('SELECT * FROM images');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS message_images (
    messageId INTEGER,
    imageId INTEGER,
    FOREIGN KEY (messageId) REFERENCES messages(id),
    FOREIGN KEY (imageId) REFERENCES images(id)
)`)
  await db.exec('INSERT INTO message_images VALUES (1, 1)')
  a = await db.all('SELECT * FROM message_images');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    userId INTEGER NOT NULL,
    contactUserId INTEGER NOT NULL,
    image BLOB,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (contactUserId) REFERENCES users(id)
)`)
  await db.exec('INSERT INTO contacts VALUES (1, 1, 1)')
  // await db.exec('INSERT INTO contacts VALUES (2, 1)')
  // await db.exec('INSERT INTO contacts VALUES (1, 3)')
  a = await db.all('SELECT * FROM contacts');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS message_reactions (
    messageId INTEGER NOT NULL,
    reactorUserId INTEGER NOT NULL,
    reactionType varchar(255) NOT NULL,
    FOREIGN KEY (messageId) REFERENCES messages(id),
    FOREIGN KEY (reactorUserId) REFERENCES users(id)
  )`)
  await db.exec('INSERT INTO message_reactions VALUES (1, 1, "💀")')
  a = await db.all('SELECT * FROM message_reactions');
  console.log(a);

})()
