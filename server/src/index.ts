import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getAllProducts, addProduct, Product } from './Controllers/Products.Controller';

const apiVersion = '/v1';

import { initDb } from './initDB';
initDb();
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT: number = 5001;

app.get('/', (req: Request, res: Response): void => {
    res.json({message: 'Hello from the API!', env_name: process.env.NAME});
});

app.get('/hello', (req: Request, res: Response): void => {
    res.json({message: 'Hello from the API!', env_name: process.env.NAME});
});

app.get(`${apiVersion}/data`, (req: Request, res: Response): void => {
    const data = {uri: process.env.MONGO_URI || "no uri",
         dbName: process.env.DB_NAME,
         user: process.env.DB_USER,
        pass: process.env.DB_PASS}
    res.json(data);
});




app.get(`${apiVersion}/products`, async (req: Request, res: Response): Promise<void> => {
    const results = await getAllProducts(res);
});

app.post(`${apiVersion}/add_product`, (req: Request, res: Response): void => {
    console.log('req.body: ', req.body);
    const newProd:Product = req.body as Product;
    addProduct(req, res, newProd);
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
    console.log('ENVIRONMENT:', process.env.NAME);
});