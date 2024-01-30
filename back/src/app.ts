import express, { Application } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import userRouter from './routes/userRouter';
import singlePlayerRouter from './routes/singlePlayerRouter';
import multiPlayerRouter, { onConnect } from './routes/multiPlayerRouter';
import { authenticateDb }  from './database/dbHandler';
import morgan from 'morgan';
import cors from 'cors';
import runManualMigrations from './database/runManualMigrations';
import * as dotenv from 'dotenv';

dotenv.config();
const port:number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const app:Application = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/users', userRouter);
app.use('/api/sp-game', singlePlayerRouter);
app.use('/api/mp-game', multiPlayerRouter);
//app.use(express.static('public'));

authenticateDb();
runManualMigrations();

const server:HTTPServer  = createServer(app);
export const io:Server  = new Server(server, {cors: {origin: 'http://localhost:3000'}});

io.on('connection', onConnect);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
