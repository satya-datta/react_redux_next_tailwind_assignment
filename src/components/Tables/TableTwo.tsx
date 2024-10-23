import { useState, useEffect, useRef } from 'react';
import { Product } from '../../types/product';
import { useAppDispatch } from '../../app/store';
import { deleteProduct, fetchProducts, updateProduct } from '../../app/slices/productSlice';
import { useNavigate } from 'react-router-dom';

const TableTwo = () => {
  const dispatch = useAppDispatch();
  const [productData, setProductData] = useState<Product[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal visibility
  const [editProduct, setEditProduct] = useState<Product | null>(null); // State for the product being edited
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchProducts()).then((result) => {
      if (result.payload) {
        setProductData(result.payload);
      }
    });
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const resultAction = await dispatch(deleteProduct(id));

    if (deleteProduct.fulfilled.match(resultAction)) {
      setAlertMessage('Product deleted successfully!');
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    } else {
      console.error('Failed to delete product:', resultAction.payload);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editProduct) return;

    const resultAction = await dispatch(updateProduct({ id: Number(editProduct.id), updatedProduct: editProduct }));

    if (updateProduct.fulfilled.match(resultAction)) {
      setAlertMessage('Product updated successfully!');
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      setIsEditModalOpen(false); // Close the modal after updating
    } else {
      console.error('Failed to update product:', resultAction.payload);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editProduct) {
      setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    }
  };
 // Function to dynamically adjust font size based on the title height
 const adjustFontSize = (titleElement: HTMLHeadingElement | null) => {
  if (titleElement) {
    let fontSize = 20; // Initial font size
    titleElement.style.fontSize = `${fontSize}px`;
    while (titleElement.scrollHeight > titleElement.clientHeight && fontSize > 14) {
      fontSize -= 1;
      titleElement.style.fontSize = `${fontSize}px`;
    }
  }
};

// Using useRef to reference each title element
const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);

// Run the font size adjustment whenever the component updates
useEffect(() => {
  titleRefs.current.forEach((titleElement) => adjustFontSize(titleElement));
}, [productData]);

  return (
    <div className="relative">
      {alertVisible && (
        <div className="fixed top-20 right-4 w-1/4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
          <p>{alertMessage}</p>
        </div>
      )}
      {isEditModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <input
              type="text"
              name="title"
              value={editProduct.title}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Title"
            />
            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Description"
            />
            <input
              type="text"
              name="image"
              value={editProduct.image}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Image URL"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">Products List</h4>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productData.map((product, key) => (
          <div
            key={key}
            className="rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark p-4 flex flex-col"
            style={{ height: '400px' }}
          >
            <div className="flex flex-col items-center flex-grow">
              <div className="h-40 w-40 rounded-md overflow-hidden">
                <img src={product.image} alt="Product" className="object-cover w-full h-full" />
              </div>
              <h5
                ref={(el) => (titleRefs.current[key] = el)}
                className="mt-4 text-lg font-medium text-black dark:text-white break-words text-center line-clamp-3"
                style={{ maxHeight: '4.5em', overflow: 'hidden' }} // Limit to 3 lines
              >
                {product.title}
              </h5>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 overflow-hidden line-clamp-3">
                {product.description}
              </p>
            </div>
            <div className="mt-auto flex justify-center space-x-3">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => navigate(`/products/${product.id}`)} // Redirect with ID
            >
              Read More
            </button>
              <button
                className="text-gray-600 hover:text-primary"
                onClick={() => handleEdit(product)}
              >
                {/* Edit icon */}
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                  />
                </svg>
              </button>
              <button
                className="text-gray-600 hover:text-primary"
                onClick={() => handleDelete(String(product.id))}
              >
                {/* Delete icon */}
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.85315 13.9785 3.96565V4.8094C13.9785 4.9219 13.866 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.9219 4.02227 4.8094V3.96565ZM12.5341 15.4938C12.506 16.0906 12.0223 16.5594 11.4255 16.5594H5.93914C5.34164 16.5594 4.85789 16.0906 4.82977 15.4938L4.39727 6.19065H13.0223L12.5341 15.4938Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};  

export default TableTwo;