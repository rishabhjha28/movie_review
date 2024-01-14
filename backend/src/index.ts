import dotenv from 'dotenv';
dotenv.config();
import express, {Express} from 'express';
import cors from 'cors';

const app:Express = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

import movieRouter from './router/movieRouter';
app.use('/movie', movieRouter);

import reviewRouter from './router/reviewRouter';
app.use('/review', reviewRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})