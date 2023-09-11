import './App.css';
import { ReactElement, useEffect, useState } from "react";
import styles from "./App.module.css";
import { Product } from "./types";
import { getAllProducts, addProduct } from "./services/product.service";
import { Demo } from "./components/Demo/Demo";

function App(): ReactElement {

  const [products, setProducts] = useState<Product[]>([])
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number>(0);

  useEffect(() => {
    getAllProducts().then(res => {
      setProducts(res);
    })
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleCtn}>
        <Demo />
        <form action=''>
          <label htmlFor="name">Product:</label>
          <input type="text" id="name" name="name" onChange={(e) => setProductName(e.target.value)} />
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" onChange={(e) => setProductPrice(parseFloat(e.target.value))} />

          <button className={'adder'}
            onClick={async () => {
              addProduct({ name: productName, price: productPrice }).then(res => {
                getAllProducts().then(res => {
                  setProducts(res);
                })
              });
            }}>Add Product: {productName} £{productPrice}</button>
        </form>
        <div className={styles.products}>
          <ul>
            {products.map(({ name, price, _id }) => {
              return (
                <li key={`prod_${_id}`} >Product: {name}: {price}</li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
