import express, {Application, Request, Response} from 'express';

const app: Application = express();
app.use(express.json());

const port:number = 3000;

app.get('/', (req:Request, res:Response) => {
    res.send('mrs');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});