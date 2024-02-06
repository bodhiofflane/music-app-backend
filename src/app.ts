import 'dotenv/config';
import cors from 'cors';

import express from 'express';
import { APPPORT } from './config/app.config';
import { client } from './db';
import fileUpload from 'express-fileupload';

import artistRouter from './routes/artist.route';
import genreRouter from './routes/genre.route';
import albumRouter from './routes/album.route';
import trackRounter from './routes/track.route';
//import trackFromAlbumRouter from './routes/trackFromAlbum.route';

const app = express();

// Common Middleware
app.use('/static', express.static('static')); // Относительно корня прокта.
app.use(cors());
app.use(express.json()); // Json parser
app.use(fileUpload()); // FormData parser

// Routes
app.use('/artist', artistRouter);
app.use('/genre', genreRouter);
app.use('/album', albumRouter);
app.use('/track', trackRounter);

// Auto start app
(async () => {
  try {
    await client.connect();
    console.log('Db connected');
    app.listen(APPPORT);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
})();

// End app
process.on('SIGINT', async () => {
  try {
    await client.end();
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
});