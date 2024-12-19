import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/navbar';  // Importing Navbar component
import './MyOrderPage.css';

function MyOrderPage() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  // Fetch customer data from /logs endpoint
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        console.log('Fetching customer data...');
        const response = await fetch('http://127.0.0.1:8000/gearup/logs/'); // Fetch customer data from logs
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const data = await response.json();
        console.log('Customer data:', data);
        setCustomer(data[0].customer); // Assuming the first log entry contains the customer info
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchCustomerData();
  }, []);

  // Fetch order data for the specific customer once the customer data is available
  useEffect(() => {
    if (customer) {
      const fetchOrderData = async () => {
        try {
          console.log('Fetching orders for customer:', customer);
          const response = await fetch(`http://127.0.0.1:8000/gearup/orders/?customer=${encodeURIComponent(customer)}`); // Fetch orders based on customer
          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }
          const data = await response.json();
          console.log('Order data:', data);
          setOrderData(data[0]); // Assuming the first order is the relevant one
        } catch (error) {
          console.error('Error fetching order data:', error);
        } finally {
          setLoading(false); // Stop loading once the data is fetched
        }
      };

      fetchOrderData();
    }
  }, [customer]);

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If no order data is found
  if (!orderData) {
    return <p>No order found for this customer.</p>;
  }

  return (
    <div>
    <div className="my-order-page-container">
      <Navbar className="my-order-navbar" />  {/* Navbar component */}
      
      <div className="my-order-info-container">
        <h2 className="my-order-header">Order Details</h2>

        {/* Displaying customer and total price */}
        <div className="my-order-summary">
          <p><strong>Customer:</strong> {orderData.customer}</p>
          <p><strong>Total Price:</strong> ₹{orderData.total_price}</p>
        </div>

        <h3>Ordered Products</h3>
        <div className="my-product-list">
          {/* Mapping through the ordered products and displaying each */}
          {orderData.order_products.map((item) => (
            <div key={item.id} className="my-product-item">
              <p><strong>Product:</strong> {item.product_name}</p>
              <p><strong>Price Per Day:</strong> ₹{item.price_per_day}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default MyOrderPage;
