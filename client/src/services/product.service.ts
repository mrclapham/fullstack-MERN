import { API_URL } from "./api_url";
import { fetchJson } from "./fetch";
import { Product } from "../types";

export const getAllProducts = async (): Promise<Product[]>=> {
    const response = await fetchJson(`${API_URL}v1/products`);
    console.log("Get All Products")
    // const response = await fetchJson(`api/v1/products`);
    return await response as Product[];
};

export const addProduct = async (product: Product): Promise <Product[]> => {
    const response = await fetch(`${API_URL}v1/add_product`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'      
          },
        body: JSON.stringify(product)
    });
    return await response.json();
};