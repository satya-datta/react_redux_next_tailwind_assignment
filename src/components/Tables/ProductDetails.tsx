// src/components/ProductDetails.tsx

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../app/slices/productSlice'; // Ensure the path is correct
import { RootState, AppDispatch } from '../../app/store'; // Adjust the import based on your structure
import './ProductDetails.css'; // Import your CSS file

const ProductDetails = () => {
  const { id } = useParams<string>(); // Get the product ID from the URL
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type

  // Fetch product details using the Redux state
  const product = useSelector((state: RootState) =>
    state.products.items.find((item) => Number(item.id) === parseInt(id!))
  );

  useEffect(() => {
    // Dispatch the fetchProductById action if the product is not already in the state
    if (!product) {
      dispatch(fetchProductById(parseInt(id!))); // Fetch the product by ID
    }
  }, [dispatch, id, product]);

  return (
    <div className="product-details">
      <h1 style={{font:"bold"}}>Product Details</h1>
      {product ? (
        <div className="product-info">
             <img src={product.image}  alt={product.title} style={{alignItems:'center', justifyContent:'center'}} className="product-image" />
          <h3>{product.title}</h3>
          <p>Price: ${product.price}</p>
          <p>{product.description}</p>
         
          {/* Include any other details you want to show here */}
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetails;
