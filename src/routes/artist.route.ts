import { Router } from 'express';
import { createArtistController, deleteArtistController, getAllArtistController, getArtistByIdController, searhArtistController, updateArtistController } from '../controllers/artist.controller';



const artistRouter = Router();

// Create artist
//artistRouter.get('/search', searhArtistController);

artistRouter.post('/', createArtistController);

artistRouter.get('/', getAllArtistController);

artistRouter.get('/:artistId', getArtistByIdController);

artistRouter.put('/:artistId', updateArtistController);

artistRouter.delete('/:artistId', deleteArtistController);

export default artistRouter;
