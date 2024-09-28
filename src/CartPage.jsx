import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function CartPage() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedCoupon, setSelectedCoupon] = useState(null); // State for selected coupon
  const coupons = [
    { id: 1, code: "CSMJU 30", discount: 30 }, // Coupon with 30% discount
    { id: 2, code: "T.Attawit Always handsome", discount: 99 }, // Coupon with 99% discount
  ];

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(
        item.price.replace("บาท", "").replace(",", "").trim()
      );
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal(); // Get subtotal
    const shippingCost = 100; // Fixed shipping cost
    const discount = selectedCoupon
      ? (subtotal * selectedCoupon.discount) / 100
      : 0; // Get discount from selected coupon
    return subtotal + shippingCost - discount; // Total = Subtotal + Shipping - Discount
  };

  useEffect(() => {
    // Update localStorage whenever the cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="bg-gray-100 py-16 min-h-screen">
      {/* Left Arrow Button */}
      <button
        className="absolute top-4 left-4 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => navigate("/")} // Navigate back to products
      >
        {/* Left Arrow SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">ตะกร้าสินค้า</h2>
        {cart.length === 0 ? (
          <p className="text-lg">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <ul className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  {/* Product Image */}
                  <div className="flex items-center">
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <p className="mx-3">{item.quantity}</p>
                        <button
                          className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-red-500 font-semibold hover:underline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">รายการสินค้าที่เลือกซื้อทั้งหมด</h3>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-lg font-medium text-gray-700">
                  รวมคำสั่งซื้อ: {getSubtotal().toLocaleString()} บาท
                </p>
                <p className="text-lg font-medium text-gray-700">
                  ค่าส่ง: 100 บาท
                </p>
                <p className="text-lg font-medium text-gray-700">
                  ส่วนลด:{" "}
                  {selectedCoupon
                    ? `${(
                        (getSubtotal() * selectedCoupon.discount) /
                        100
                      ).toLocaleString()} บาท`
                    : "0 บาท"}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-4">
                  ยอดชำระทั้งหมด: {getTotalPrice().toLocaleString()} บาท
                </p>
              </div>

              {/* Coupon Selection */}
              <div className="mt-4">
                <label
                  htmlFor="coupon"
                  className="block text-gray-700 font-medium mb-2"
                >
                  โค้ดส่วนลด:
                </label>
                <select
                  id="coupon"
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  onChange={(e) => {
                    const couponId = e.target.value;
                    const coupon = coupons.find(
                      (c) => c.id === Number(couponId)
                    );
                    setSelectedCoupon(coupon || null);
                  }}
                  value={selectedCoupon ? selectedCoupon.id : ""}
                >
                  <option value="">เลือกคูปอง</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.code} - {coupon.discount}% off
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-600 transition-colors"
                onClick={() => alert("สั่งซื้อสำเร็จ")}
              >
                ยืนยันคำสั่งซื้อ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
