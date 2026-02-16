// ProductsList.js
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaImage } from 'react-icons/fa';
import './ProductsList.css';

const ProductsList = ({ sellerToken, onBackToDashboard }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [categories, setCategories] = useState([]);

  const fetchProducts = React.useCallback(async () => {
    try {
      const tokenPayload = JSON.parse(atob(sellerToken.split('.')[1]));
      const sellerId = tokenPayload.id || tokenPayload.sellerId;

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/seller/products/seller/${sellerId}`,
        {
          headers: {
            'Authorization': `Bearer ${sellerToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [sellerToken]);

  useEffect(() => {
    fetchProducts();
    // Mock categories - you might want to fetch these from an API
    setCategories(['Clothing', 'Electronics', 'Home & Kitchen', 'Beauty', 'Sports', 'Books']);
  }, [fetchProducts]);



  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory,
      discount: product.discount,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      tagline: product.tagline.join(', '),
      createdBy: product.createdBy
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEdit = async (productId) => {
    try {
      // Convert tagline string to array
      const taglineArray = editFormData.tagline
        ? editFormData.tagline.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [];

      const updatedProduct = {
        name: editFormData.name,
        slug: editFormData.slug,
        shortDescription: editFormData.shortDescription,
        description: editFormData.description,
        image: editFormData.image,
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock),
        sku: editFormData.sku,
        category: editFormData.category,
        subcategory: editFormData.subcategory,
        discount: parseFloat(editFormData.discount) || 0,
        isAvailable: editFormData.isAvailable,
        isFeatured: editFormData.isFeatured,
        tagline: taglineArray,
        createdBy: editFormData.createdBy
      };

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/seller/product/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sellerToken}`
          },
          body: JSON.stringify(updatedProduct)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Refresh the products list
      await fetchProducts();
      setEditingProduct(null);
      setEditFormData({});
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/seller/product/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sellerToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the products list
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
  };

  if (loading) {
    return (
      <div className="seller-products-loading">
        <div className="seller-loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-products-error">
        <p>Error: {error}</p>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="seller-products-container">
      <div className="seller-products-header">
        <button className="seller-btn-back" onClick={onBackToDashboard}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2>Your Products</h2>
        <p>Total: {products.length} products</p>
      </div>

      <div className="seller-products-grid">
        {products.map(product => (
          <div key={product.id} className="seller-product-card">
            <div className="seller-product-image">
              <img src={product.image} alt={product.name} />
              {editingProduct === product.id && (
                <div className="seller-image-overlay">
                  <FaImage />
                  <span>Change Image</span>
                </div>
              )}
            </div>

            <div className="seller-product-info">
              {editingProduct === product.id ? (
                // Edit Form
                <div className="seller-edit-form">
                  <div className="seller-form-row">
                    <div className="seller-form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                        required
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Slug</label>
                      <input
                        type="text"
                        name="slug"
                        value={editFormData.slug}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                      />
                    </div>
                  </div>

                  <div className="seller-form-group">
                    <label>Short Description *</label>
                    <textarea
                      name="shortDescription"
                      value={editFormData.shortDescription}
                      onChange={handleEditChange}
                      className="seller-edit-textarea"
                      rows="2"
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label>Full Description *</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      className="seller-edit-textarea"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="seller-form-row">
                    <div className="seller-form-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={editFormData.stock}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="seller-form-row">
                    <div className="seller-form-group">
                      <label>SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={editFormData.sku}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={editFormData.discount}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="seller-form-row">
                    <div className="seller-form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditChange}
                        className="seller-edit-select"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="seller-form-group">
                      <label>Subcategory</label>
                      <input
                        type="text"
                        name="subcategory"
                        value={editFormData.subcategory}
                        onChange={handleEditChange}
                        className="seller-edit-input"
                      />
                    </div>
                  </div>

                  <div className="seller-form-group">
                    <label>Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      value={editFormData.image}
                      onChange={handleEditChange}
                      className="seller-edit-input"
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label>Tagline (comma separated)</label>
                    <input
                      type="text"
                      name="tagline"
                      value={editFormData.tagline}
                      onChange={handleEditChange}
                      className="seller-edit-input"
                      placeholder="casual, cotton, comfortable"
                    />
                  </div>

                  <div className="seller-form-group">
                    <label>Created By</label>
                    <input
                      type="text"
                      name="createdBy"
                      value={editFormData.createdBy}
                      onChange={handleEditChange}
                      className="seller-edit-input"
                    />
                  </div>

                  <div className="seller-checkbox-group">
                    <label className="seller-checkbox-label">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={editFormData.isAvailable}
                        onChange={handleEditChange}
                      />
                      <span className="seller-checkbox-custom"></span>
                      Available for purchase
                    </label>
                    <label className="seller-checkbox-label">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={editFormData.isFeatured}
                        onChange={handleEditChange}
                      />
                      <span className="seller-checkbox-custom"></span>
                      Featured product
                    </label>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <h3>{product.name}</h3>
                  <div className="seller-price-container">
                    <span className="seller-product-price">
                      {formatCurrency(calculateDiscountedPrice(product.price, product.discount))}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="seller-original-price">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="seller-discount-badge">
                          {product.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="seller-product-stock">Stock: {product.stock} units</p>
                  <p className="seller-product-sku">SKU: {product.sku}</p>
                  <p className="seller-product-category">
                    Category: {product.category} {product.subcategory && `> ${product.subcategory}`}
                  </p>
                  <div className="seller-product-stats">
                    <span className="seller-stat">Views: {product.viewCount}</span>
                    <span className="seller-stat">Sold: {product.soldCount}</span>
                    <span className="seller-stat">Rating: {product.averageRating}/5</span>
                  </div>
                  <div className="seller-product-tags">
                    {product.tagline.map((tag, index) => (
                      <span key={index} className="seller-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="seller-product-meta">
                    <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                    <p>By: {product.createdBy}</p>
                    <div className="seller-status-badges">
                      {product.isAvailable && (
                        <span className="seller-status-badge available">Available</span>
                      )}
                      {product.isFeatured && (
                        <span className="seller-status-badge featured">Featured</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="seller-product-actions">
              {editingProduct === product.id ? (
                <>
                  <button
                    className="seller-btn-save"
                    onClick={() => handleSaveEdit(product.id)}
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    className="seller-btn-cancel"
                    onClick={handleCancelEdit}
                  >
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="seller-btn-view">
                    <FaEye /> View
                  </button>
                  <button
                    className="seller-btn-edit"
                    onClick={() => handleEditClick(product)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="seller-btn-delete"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;