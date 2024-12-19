import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import logo from "../Pictures/GEAR UP (1).png";
import cartIcon from "../Pictures/cart.png"; // Replace with your cart icon path
import deleteIcon from "../Pictures/delete.png"; // Replace with your delete icon path
import "./navbar.css";

const Navbar = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  // Fetch customer from /logs
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const logsResponse = await fetch("http://127.0.0.1:8000/gearup/logs/");
        if (!logsResponse.ok) {
          throw new Error("Failed to fetch customer details");
        }
        const logsData = await logsResponse.json();
        const customerName = logsData[0]?.customer;
        if (customerName) {
          setCustomer(customerName);
        } else {
          throw new Error("Customer not found in logs response");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, []);

  // Fetch cart items for the customer
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!customer) return;

      try {
        setLoading(true);
        const cartsResponse = await fetch(
          `http://127.0.0.1:8000/gearup/carts/?customer=${customer}`
        );
        if (!cartsResponse.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const cartData = await cartsResponse.json();

        // Fetch product details for each cart item
        const cartItemsWithDetails = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await fetch(
              `http://127.0.0.1:8000/gearup/products/${item.product}/`
            );
            if (!productResponse.ok) {
              throw new Error(
                `Failed to fetch product details for product ID: ${item.product}`
              );
            }
            const productData = await productResponse.json();
            return {
              cartItemId: item.id, // Store the cart item ID separately
              productId: item.product, // Product ID should be used in order and delete requests
              productName: productData.name,
              pricePerDay: productData.price_per_day,
            };
          })
        );

        setCartItems(cartItemsWithDetails);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [customer]);

  // Delete cart item
  const handleDelete = async (cartItemId) => {
    try {
      const cartItemToDelete = cartItems.find(item => item.cartItemId === cartItemId);
      if (!cartItemToDelete) {
        throw new Error("Cart item not found");
      }

      const deleteResponse = await fetch(
        `http://127.0.0.1:8000/gearup/carts/${cartItemId}/`,
        {
          method: "DELETE",
        }
      );

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete cart item");
      }

      // Remove item from local state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cartItemId !== cartItemId)
      );
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleOrderNow = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed with the order.");
      return;
    }
  
    // Collect the list of cart item IDs from the cart (use the cartItemId)
    const cartItemIds = cartItems.map((item) => item.cartItemId);
  
    // Send POST request to create an order
    try {
      const orderResponse = await fetch("http://127.0.0.1:8000/gearup/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customer, // Use the customer's email or ID as a string
          products: cartItems.map((item) => item.productId), // List of product IDs from the cart
        }),
      });
  
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(`Failed to create order: ${errorData.error || "Unknown error"}`);
      }
  
      // After the order is created, remove the products from the cart using cartItemId
      await Promise.all(
        cartItemIds.map((cartItemId) =>
          fetch(`http://127.0.0.1:8000/gearup/carts/${cartItemId}/`, {
            method: "DELETE",
          })
        )
      );
  
      // Remove items from the local cart state
      setCartItems([]);
  
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>GEARUP RENTALS</h1>
      </div>
      <div className="nav-right">
        <div
          className="cart-container"
          ref={cartRef}
          onClick={() => setIsCartOpen(!isCartOpen)} // Toggle cart visibility on click
        >
          <img src={cartIcon} alt="Cart" className="cart-icon" />
          {isCartOpen && (
            <div className="cart-dropdown">
              <h3 className="Cart-Head">Cart Items</h3>
              {loading ? (
                <p>Loading...</p>
              ) : cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div className="cart-item" key={item.cartItemId}>
                    <div className="cart-item-info">
                      <span className="product-name">{item.productName}</span>
                      <span className="price-per-day">₹{item.pricePerDay} per day</span>
                    </div>
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing the dropdown when clicking delete
                        handleDelete(item.cartItemId);
                      }}
                    />
                  </div>
                ))
              ) : (
                <p>Your cart is empty</p>
              )}
              <button className="order-now-button" onClick={handleOrderNow}>
                Order Now
              </button>
            </div>
          )}
        </div>

        {/* Add the "My Order" link here */}
        <Link to="/my-order" className="my-order-link">
          My Orders
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
