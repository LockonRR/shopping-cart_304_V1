import { useState, useEffect } from "react";
import { products as initialProducts } from "./data.jsx"; // Import initial products data
import { AiOutlineShoppingCart } from "react-icons/ai"; // Import the shopping cart icon

export default function ProductList() {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [products, setProducts] = useState(initialProducts); // Add a state for products to track stock

  useEffect(() => {
    // Update localStorage whenever the cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (product.stock > 0) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          // If product already in cart, increase its quantity
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new product to cart
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });

      // Decrease the stock of the product
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.id === product.id ? { ...item, stock: item.stock - 1 } : item
        )
      );
    } else {
      alert("Out of stock");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            CONCEPT_RR
          </h1>
        </div>
      </nav>

      {/* Shopping Cart Icon */}
      <a
        href="/cart"
        className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center"
      >
        <AiOutlineShoppingCart className="w-8 h-8" />
        {cart.length > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            {cart.length}
          </span>
        )}
      </a>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Products
        </h2>
        <ul className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-h-1 aspect-w-1 w-full h-64 bg-gray-200 overflow-hidden">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm text-gray-700">{product.name}</h3>
                <p className="text-lg font-medium text-gray-900">
                  {product.price}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock > 0 ? product.stock : "Out of stock"}
                </p>
                <button
                  className={`mt-2 w-full px-4 py-2 rounded-lg font-semibold ${
                    product.stock > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
