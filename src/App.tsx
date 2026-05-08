import { useEffect, useState } from "react";
import "./App.css";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const checkout = () => {
    setCart([]);
    alert("Checkout successful! Your cart has been cleared.");
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container">
      <h1>Advanced React E-Commerce App</h1>

      <h2>Products</h2>

      <div className="products">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Shopping Cart</h2>

      <div className="cart">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.title}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))
        )}

        <h3>Total Items: {cart.length}</h3>
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>

        {cart.length > 0 && <button onClick={checkout}>Checkout</button>}
      </div>
    </div>
  );
}

export default App;