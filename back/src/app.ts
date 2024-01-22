import express, { Application } from 'express';
import userRouter from './routes/userRouter';
import singlePlayerRouter from './routes/singlePlayerRouter';
import { authenticateDb }  from './database/dbHandler';
import morgan from 'morgan';
import cors from 'cors';
import runManualMigrations from './database/runManualMigrations';

const port:number = 5000;
const app:Application = express();
app.use(cors({origin: 'http://localhost:3000'}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/users', userRouter);
app.use('/api/sp-game', singlePlayerRouter);
//app.use(express.static('public'));

authenticateDb();
//runManualMigrations();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
