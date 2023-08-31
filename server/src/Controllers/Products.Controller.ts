import { Request, Response } from 'express';
import { Product } from "../Models/Product.model";

export type Product = {
  id?: string;
  name: string;
  price: number;
}

export const getAllProducts = async (res: Response) => {
    try {
      const results = await Product.find({});
      res.send(results);
    } catch (error) {
      console.log(error);
    }
  };

export const addProduct = async (req: Request, res: Response, product: Product): Promise<void> => {
    try {
      //const newProduct =req.body as Product;
      const results = await Product.collection.insertOne(product);
      res.send(results);
    } catch (error) {
      console.log(error);
    }
  }