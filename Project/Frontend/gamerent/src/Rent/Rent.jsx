import React from 'react';
import './Rent.css';
import PS5Image from '../Pictures/ps5.jpg';
import xboxImg from '../Pictures/Xbox Series S Console.jpg';
import xconImg from '../Pictures/xbox.jpg';
import ps5conImg from '../Pictures/ps5con.jpg';
import vr from '../Pictures/vr.jpg';
import cod from '../Pictures/cod.jpg';
import fifa from '../Pictures/fifa.jpg';
import nin from '../Pictures/nin.jpg';
import Navbar from '../Navbar/navbar';

const products = [
  { id: 1, name: 'PlayStation 5 Console', price: '₹499 - per day', image: PS5Image },
  { id: 2, name: 'Xbox Series X Console', price: '₹499 - per day', image: xboxImg },
  { id: 3, name: 'PS5 Controller', price: '₹199 - per day', image: xconImg },
  { id: 4, name: 'Xbox Controller', price: '₹199 - per day', image: ps5conImg },
  { id: 5, name: 'Oculus VR Set', price: '₹399 - per day', image: vr },
  { id: 6, name: 'Video Game CD: Call of Duty', price: '₹199 - per day', image: cod },
  { id: 7, name: 'Video Game CD: FIFA 24', price: '₹149 - per day', image: fifa },
  { id: 8, name: 'Nintendo Switch Console', price: '₹399 - per day', image: nin }
];

const ProductCard = ({ product, handleRentNow }) => (
  <div className="unique-product-card">
    <img src={product.image} alt={product.name} className="unique-product-image" />
    <h3>{product.name}</h3>
    <p className="unique-price">{product.price}</p>
    <button className="unique-rent-now-button" onClick={() => handleRentNow(product.id)}>
      Rent Now
    </button>
  </div>
);

function Rent() {
  const handleRentNow = async (productId) => {
    try {
      // Fetch customer from the logs API
      const logsResponse = await fetch('http://127.0.0.1:8000/gearup/logs/');
      if (!logsResponse.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const logsData = await logsResponse.json();
      console.log('Logs API Response:', logsData);

      // Extract the customer field from the logs API response
      const customerName = logsData[0]?.customer; // Assuming customer is in the first object
      if (!customerName) {
        throw new Error('Customer name not found in logs response');
      }

      // Prepare the payload
      const payload = {
        product: productId,
        customer: customerName // Ensure customer name is included as a string
      };
      console.log('Payload:', payload);

      // Send the POST request to the carts API
      const cartResponse = await fetch('http://127.0.0.1:8000/gearup/carts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!cartResponse.ok) {
        const errorData = await cartResponse.json();
        console.error('Error Response:', errorData);
        throw new Error('Failed to add product to cart');
      }

      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="unique-rent">
      <Navbar />
      <div className="unique-products-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} handleRentNow={handleRentNow} />
        ))}
      </div>
    </div>
  );
}

export default Rent;
