import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { withApiRoutes } from './controllers';
import { Server } from 'socket.io';
import http from 'http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.BASE || '/';
const PORT = +(process.env.PORT || 0) || 3000;

const isProduction = process.env.NODE_ENV === 'production';

const createApp = async () => {
  const templateHtml = isProduction
    ? await readFile(join(__dirname, 'client', 'index.html'), 'utf-8')
    : '';

  const app = express();
  let viteServer: any;

  if (isProduction) {
    const sirv = (await import('sirv')).default;
    app.use(BASE, sirv(join(__dirname, 'client'), { extensions: [] }));
  } else {
    const vite = await import('vite');
    viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(viteServer.middlewares);
  }

  withApiRoutes(app);

  app.use('*', async (req, res) => {
    const url = req.originalUrl.replace(BASE, '');
    let html = templateHtml;

    if (!isProduction) {
      html = await readFile('index.html', 'utf-8');
      html = await viteServer.transformIndexHtml(url, html);
    }

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  });

  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  // Socket.io connection
  io.on('connection', socket => {
    console.log('User connected');

    socket.on('chat message', async msg => {
      const { chatId, userId, text } = msg;
      try {
        const db = await open({
          filename: join(__dirname, 'database', 'database.db'),
          driver: sqlite3.Database
        });
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        await db.run(
          'INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)',
          [chatId, userId, createdAt, updatedAt, text]
        );
        const message = await db.get(
          'SELECT * FROM messages WHERE chatId = ? AND userId = ? AND createdAt = ? AND updatedAt = ? AND message = ?',
          [chatId, userId, createdAt, updatedAt, text]
        );
        io.emit('chat message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
};

createApp().catch((err) => console.log(err));
