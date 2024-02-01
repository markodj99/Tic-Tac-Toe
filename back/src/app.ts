import express, { Application } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import { authenticateDb }  from './database/dbHandler';
import morgan from 'morgan';
import cors from 'cors';
import runManualMigrations from './database/runManualMigrations';
import * as dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema';
import { resolvers, onConnect } from './graphql/resolver';

dotenv.config();
const port:number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const app:Application = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static('public'));

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
});
apolloServer.applyMiddleware({ app, path: '/graphql'});

authenticateDb();
runManualMigrations();

const server:HTTPServer  = createServer(app);
export const io:Server  = new Server(server, {cors: {origin: 'http://localhost:3000'}});

io.on('connection', onConnect);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
