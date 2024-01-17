import express, { Application } from 'express';
import userRouter from './routes/userRouter';
import { authenticate }  from './database/dbHandler';
import { up } from './models/user';
import morgan from 'morgan';

const port:number = 3000;
const app:Application = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/users', userRouter);
//app.use(express.static('public'));


authenticate();
const runMigrations = async () => {
    try {
      await up();
      console.log('Migration of user table is done.');
    } catch (error) {
      console.error('Migration of user resulted in an error:', error);
    }
};
//runMigrations();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
