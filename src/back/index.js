// const http = require('http');
// const hostname = '127.0.0.1';
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const cors = require('cors');
// const path = require('path')
const express = require('express')
// const bodyParser = require('body-parser');
// const { Server } = require("socket.io");
// const { Socket } = require('dgram');
const CLIENT_ID = "2897c730c31dd10adb98";
const CLIENT_SECRET = "5e58f80274b20bc1fe8cf264011d230290c4c72e";
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;
let sockets = []
server.listen(port, () => {
    console.log("Connected")
})
app.use(cors());
app.use(bodyParser.json());
const io = require('socket.io')(server, {
    cors: {
         origin: 'http://localhost:3000'
       // origin: 'team4.ya-itmo.ru:3000'
    }
})

open({
    filename: './database/database.db',
    driver: sqlite3.Database
}).then(async (db) => {
    console.log("Database connected");

    app.use(express.json());

    app.get('/getAccessToken', async function (req, res) {
        const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
        console.log("test1")
        await fetch("https://github.com/login/oauth/access_token" + params, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            res.json(data);
        })
    })

    app.get('/getUserData', async function (req, res) {
        req.get("Authorization");
        await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": req.get("Authorization")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            res.json(data);
        })
    })

    // Route to get all messages
    app.get('/getAllMessages', async (req, res) => {
        try {
            const messages = await db.all('SELECT * FROM messages');
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).send('Error fetching messages');
        }
    });


  app.get('/getAccessToken', async function (req, res) {


    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
    console.log("test1")
    await fetch("https://github.com/login/oauth/access_token" + params, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      res.json(data);
    })
  })

  app.get('/getUserData', async function (req, res) {
    req.get("Authorization");
    await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "Authorization": req.get("Authorization")
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      res.json(data);
    })
  })

  function intersection(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(value => set2.has(value));
  }

  // Route to create a new chat
  app.post('/createChat', async (req, res) => {
    const {name, userIds} = req.body;
    try {
        var arr = [];
        for (const userId of userIds) {
            const chats = await db.all(
                `SELECT * FROM usersToChats WHERE idUser = ?`,
                userId
            );
            var tmp = [];
            for (const chat of chats) {
                tmp.push(chat.idChat);
            }
            arr.push(tmp);
        }
        // console.log(intersection(...arr))
        if (intersection(...arr) != []) {
            res.status(201).send('Chat already exists');
        } else {
        // Insert chat into chats table
        const result = await db.run(
            'INSERT INTO chats (name) VALUES (?)',
            name
        );
        const chatId = result.lastID;

            // Insert records into chatsToUsers table
            for (const userId of userIds) {
                await db.run(
                    'INSERT INTO chatsToUsers (idChat, idUser) VALUES (?, ?)',
                    [chatId, userId]
                );
            }


            res.status(201).send('Chat created successfully');
        }
    } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).send('Error creating chat');
    }});

    // Route to get user by login and password
    app.get('/getUser', async (req, res) => {
        const { login, password } = req.query;
        try {
            const user = await db.get(
                'SELECT * FROM users WHERE login = ? AND password = ?',
                [login, password]
            );
            if (user) {
                res.json(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Error fetching user');
        }
    });

    // Route to get all chats
    app.get('/getChats', async (req, res) => {
        try {
            const chats = await db.all('SELECT * FROM chats');
            res.json(chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).send('Error fetching chats');
        }
    });

     

     // Route to get all chats
     app.get('/getChat/:chatId', async (req, res) => {
        try {
            const chats = await db.all('SELECT FROM chats WHERE chatId = ?',
                chatId
            );
            res.json(chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).send('Error fetching chats');
        }
    });

    // Route to delete a user
    app.delete('/deleteUser/:userId', async (req, res) => {
        const userId = req.params.userId;
        try {
            await db.run(
                'DELETE FROM users WHERE id = ?',
                userId
            );
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        }
    });

    // Route to delete a chat
    app.delete('/deleteChat/:chatId', async (req, res) => {
        const chatId = req.params.chatId;
        try {
            // Delete chat from chats table
            await db.run(
                'DELETE FROM chats WHERE id = ?',
                chatId
            );

            // Delete associated records from chatsToUsers table
            await db.run(
                'DELETE FROM chatsToUsers WHERE idChat = ?',
                chatId
            );

            // Delete associated messages
            await db.run(
                'DELETE FROM messages WHERE chatId = ?',
                chatId
            );
        } catch (error) {
            console.error('Error deleting chat:', error);
            res.status(500).send('Error deleting chat');
        }
    });

    app.post('./createUser', async (username, password) => { //todo Implement hashing of the password
        const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the saltRounds
    
        db.run('INSERT INTO users (login, password, icon) VALUES (?, ?, ?)', [username, hashedPassword, getIcon], function(err) {
            if (err) {
                console.error('Error creating user:', err.message);
            } else {
                console.log('User created successfully');
            }
        });
    });

    app.get('./verifyPassword', async (username, password, callback) =>{
        db.get('SELECT hashed_password FROM users WHERE username = ?', [username], function(err, row) {
            if (err) {
                callback(err);
            } else if (!row) {
                callback(null, false); // User not found
            } else {
                const hashedPassword = row.hashed_password;
                callback(null, bcrypt.compareSync(password, hashedPassword));
            }
        });
    });

    app.post('./addImageToDatabase', async (chatId, userId, createdAt, updatedAt, imagePath, name, text) => {
        let image = fs.readFileSync(imagePath);
        try {
            await db.run(
                'INSERT INTO messages (chatId, userId, createdAt, updatedAt, text) VALUES (?, ?)',
                [chatId, userId, createdAt, updatedAt, text]
            );
            const message = await db.get(
                'SELECT * FROM messages WHERE chatId = ? AND userId = ? AND createdAt = ? AND updatedAt = ? AND text = ?) VALUES (?, ?, ?, ?, ?)',
                [chatId, userId, createdAt, updatedAt, text]
            );
            await db.run(
                'INSERT INTO message_images (messageId, imageId) VALUES (?, ?)',
                [message.messageId, image]
            );
            await db.run(
                'INSERT INTO images (imageName, imageData) VALUES (?, ?)',
                [name, image]
            );
            
        } catch (error) {
            console.error('Error posting image:', error);
        }
    });

    app.get('./getImageByMessage', async (req, res) => {
        const {messageId} = req.body;
        try {
            const images = await db.all(
                'SELECT * FROM message_images WHERE messageID = ?',
                messageId
            );
            res.json(images)
        } catch (error) {
            console.error('Error posting image:', error);
        }
    });

    // // Route to add a new user
    // app.post('/addUser', async (req, res) => {
    //     const { login, password, icon } = req.body;
    //     try {
    //         await db.run(
    //             'INSERT INTO users (login, password, icon) VALUES (?, ?, ?)',
    //             [login, password, icon]
    //         );
    //     } catch (error) {
    //         console.error('Error adding user:', error);
    //         res.status(500).send('Error adding user');
    //     }
    // });

    // // Route to add a new chat
    // app.post('/addChat', async (req, res) => {
    //     const { name, icon } = req.body;
    //     try {
    //         await db.run(
    //             'INSERT INTO chats (name, icon) VALUES (?, ?)',
    //             [name, icon]
    //         );
    //     } catch (error) {
    //         console.error('Error adding chat:', error);
    //         res.status(500).send('Error adding chat');
    //     }
    // });

    io.on('connection', socket => {
        console.log('User connected');

        sockets.push(socket)

        socket.on('chat message', async req => {


            const { chatId, userId, createdAt, updatedAt, text } = req;//THIS
            console.log(text)

            try {
                const createdAt = new Date().toISOString();
                const updatedAt = createdAt;
                await db.run(
                    'INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)',
                    [chatId, userId, createdAt, updatedAt, text]
                )
                const messag = await db.get(
                    'SELECT * FROM messages WHERE chatId = ? AND userId = ? AND createdAt = ? AND updatedAt = ? AND message = ?',
                    [chatId, userId, createdAt, updatedAt, text]
                );
                for (const socke of sockets) {
                    socke.emit('chat message', messag)
                }
            } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).send('Error sending message');
            }
        });

        // socket.on('update message', async message => {
        //     const { text, messageId } = req.body;
        //     try {
        //         const updatedAt = new Date().toISOString();
        //         await db.run(
        //             'UPDATE messages SET message = ? WHERE id = ? SET updatedAt = ?',
        //             [text, messageId, updatedAt]
        //         )
        //         const messag = await db.get(
        //             'SELECT * FROM messages WHERE message = ? WHERE id = ? SET updatedAt = ?',
        //             [text, messageId, updatedAt]
        //         );
        //         for (const socke of sockets) {//todo создать инстанс в бд, возвращать созданную строку
        //             socket.emit('update message', messag)
        //         }

        //     } catch (error) {
        //         console.error('Error sending message:', error);
        //         res.status(500).send('Error sending message');
        //     }
        // });

        // //todo
        // socket.on('delete message', async message => {
        //     const { messageId } = req.body;
        //     try {
        //         await db.run(
        //             'DELETE FROM messages WHERE id = ?',
        //                 messageId
        //         )
        //         // socket.emit('chat message', message)
        //     } catch (error) {
        //         console.error('Error sending message:', error);
        //         res.status(500).send('Error sending message');
        //     }
        // });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            sockets = sockets.filter(s => s !== socket)
        });
    });
}).catch(error => {
    console.error('Error connecting to database:', error);
});
require('./generateIcon.js');
  

// function createUser(username, password) { //todo Implement hashing of the password
//     const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the saltRounds

//     db.run('INSERT INTO users (login, password, icon) VALUES (?, ?, ?)', [username, hashedPassword, getIcon], function(err) {
//         if (err) {
//             console.error('Error creating user:', err.message);
//         } else {
//             console.log('User created successfully');
//         }
//     });
// }

// function verifyPassword(username, password, callback) {
//     db.get('SELECT hashed_password FROM users WHERE username = ?', [username], function(err, row) {
//         if (err) {
//             callback(err);
//         } else if (!row) {
//             callback(null, false); // User not found
//         } else {
//             const hashedPassword = row.hashed_password;
//             callback(null, bcrypt.compareSync(password, hashedPassword));
//         }
//     });
// }
// async function addImageToDatabase(userId, messageId, imagePath) {
//     let image = fs.readFileSync(imagePath);
//     try {
//         await db.run(
//             'INSERT INTO message_images (userId, messageId, image) VALUES (?, ?, ?)',
//             [userId, messageId, image]
//         );
//     } catch (error) {
//         console.error('Error adding chat:', error);
//     }
// }


//http://localhost:3000/api/users

