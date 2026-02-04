import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './ProductModal.css';

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    mrp: '',
    sellingPrice: '',
    brand: '',
    exchangeEligible: '',
    images: []
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const productTypes = ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        type: product.type || '',
        quantity: product.quantity?.toString() || '',
        mrp: product.mrp?.toString() || '',
        sellingPrice: product.sellingPrice?.toString() || '',
        brand: product.brand || '',
        exchangeEligible: product.exchangeEligible || '',
        images: []
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.type) newErrors.type = 'Product type is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (parseInt(formData.quantity) < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (!formData.mrp) newErrors.mrp = 'MRP is required';
    if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
    else if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) {
      newErrors.sellingPrice = 'Selling price cannot be greater than MRP';
    }
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    if (!formData.exchangeEligible) newErrors.exchangeEligible = 'Exchange eligibility is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });

      // Add existing images
      existingImages.forEach(image => {
        submitData.append('existingImages', image);
      });

      // Add new images
      newImages.forEach(image => {
        submitData.append('images', image);
      });

      if (product) {
        await productsAPI.update(product._id, submitData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(submitData);
        toast.success('Product created successfully');
      }

      onSave();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageName) => {
    return `http://localhost:5000/uploads/${imageName}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Product Type *</label>
            <select
              id="type"
              name="type"
              className={`select ${errors.type ? 'error' : ''}`}
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="">Select product type</option>
              {productTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <div className="error-text">{errors.type}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity Stock *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className={`input ${errors.quantity ? 'error' : ''}`}
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
              {errors.quantity && <div className="error-text">{errors.quantity}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="mrp">MRP *</label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                className={`input ${errors.mrp ? 'error' : ''}`}
                value={formData.mrp}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.mrp && <div className="error-text">{errors.mrp}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sellingPrice">Selling Price *</label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                className={`input ${errors.sellingPrice ? 'error' : ''}`}
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.sellingPrice && <div className="error-text">{errors.sellingPrice}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand Name *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                className={`input ${errors.brand ? 'error' : ''}`}
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
              />
              {errors.brand && <div className="error-text">{errors.brand}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exchangeEligible">Exchange / Return Eligibility *</label>
            <select
              id="exchangeEligible"
              name="exchangeEligible"
              className={`select ${errors.exchangeEligible ? 'error' : ''}`}
              value={formData.exchangeEligible}
              onChange={handleInputChange}
            >
              <option value="">Select eligibility</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.exchangeEligible && <div className="error-text">{errors.exchangeEligible}</div>}
          </div>

          <div className="form-group">
            <label>Product Images</label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="images-section">
                <h4>Current Images</h4>
                <div className="images-grid">
                  {existingImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={getImageUrl(image)} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeExistingImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImages.length > 0 && (
              <div className="images-section">
                <h4>New Images</h4>
                <div className="images-grid">
                  {newImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeNewImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="file-input-wrapper">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="images" className="file-input-label">
                📷 Add More Photos
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <div className="loading"></div> : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;