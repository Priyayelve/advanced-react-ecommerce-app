import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import "./App.css";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface CartItem extends Product {
  cartId: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchOrders(currentUser.uid);
      }
    });

    fetchProductsFromFirestore();

    return () => unsubscribe();
  }, []);

  const fetchProductsFromFirestore = async () => {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);

    if (snapshot.empty) {
      const response = await fetch("https://fakestoreapi.com/products");
      const data: Product[] = await response.json();

      for (const product of data) {
        await addDoc(productsCollection, product);
      }

      setProducts(data);
    } else {
      const firestoreProducts = snapshot.docs.map(
        (document) => document.data() as Product
      );

      setProducts(firestoreProducts);
    }
  };

  const register = async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: new Date(),
    });

    alert("Registration successful!");
    setEmail("");
    setPassword("");
  };

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    setEmail("");
    setPassword("");
  };

  const logout = async () => {
    await signOut(auth);
    setOrders([]);
  };

  const addToCart = (product: Product) => {
    const newItem: CartItem = {
      ...product,
      cartId: Date.now() + Math.random(),
    };

    setCart([...cart, newItem]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const checkout = async () => {
    if (!user) {
      alert("Please login before checkout.");
      return;
    }

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      products: cart,
      totalItems: cart.length,
      totalPrice: totalPrice,
      createdAt: new Date(),
    });

    setCart([]);
    fetchOrders(user.uid);
    alert("Order saved to Firestore successfully!");
  };

  const fetchOrders = async (userId: string) => {
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(ordersQuery);

    const orderList = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    setOrders(orderList);
  };

  return (
    <div className="container">
      <h1>Advanced React E-Commerce App</h1>

      <div className="auth-box">
        <h2>Firebase Authentication</h2>

        {user ? (
          <>
            <p>Logged in as: {user.email}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
          </>
        )}
      </div>

      <h2>Products from Firestore</h2>

      <div className="products">
        {products.map((product, index) => (
          <div className="card" key={index}>
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
            <div key={item.cartId} className="cart-item">
              <p>{item.title}</p>
              <button onClick={() => removeFromCart(item.cartId)}>
                Remove
              </button>
            </div>
          ))
        )}

        <h3>Total Items: {cart.length}</h3>
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>

        {cart.length > 0 && <button onClick={checkout}>Checkout</button>}
      </div>

      <h2>Order History</h2>

      <div className="cart">
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="cart-item">
              <p>
                Order ID: {order.id} | Items: {order.totalItems} | Total: $
                {order.totalPrice.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;