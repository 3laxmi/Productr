import React from 'react';
import { productsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product, onUpdate, onEdit, onDelete, showActions = false }) => {
  const handleTogglePublish = async () => {
    try {
      await productsAPI.togglePublish(product._id);
      const action = product.isPublished ? 'unpublished' : 'published';
      toast.success(`Product ${action} successfully`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const getImageUrl = (imageName) => {
    return `http://localhost:5000/uploads/${imageName}`;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img 
            src={getImageUrl(product.images[0])} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEyNSA3NUwxNzUgMTI1SDE3NVYxNzVIMjVWMTI1TDc1IDc1TDEwMCAxMDBaIiBmaWxsPSIjRDFENUQ5Ii8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjYwIiByPSIxNSIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4K';
            }}
          />
        ) : (
          <div className="no-image">📷</div>
        )}
        <div className="image-count">
          {product.images?.length || 0} photos
        </div>
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-actions">
            <button 
              className={`btn ${product.isPublished ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleTogglePublish}
            >
              {product.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            {showActions && (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(product)}
                  title="Delete Product"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>

        <div className="product-details">
          <div className="detail-row">
            <span className="label">Type:</span>
            <span className="value">{product.type}</span>
          </div>
          <div className="detail-row">
            <span className="label">Brand:</span>
            <span className="value">{product.brand}</span>
          </div>
          <div className="detail-row">
            <span className="label">Stock:</span>
            <span className="value">{product.quantity} units</span>
          </div>
          <div className="detail-row">
            <span className="label">MRP:</span>
            <span className="value">₹{product.mrp}</span>
          </div>
          <div className="detail-row">
            <span className="label">Selling Price:</span>
            <span className="value price">₹{product.sellingPrice}</span>
          </div>
          <div className="detail-row">
            <span className="label">Exchange:</span>
            <span className={`value ${product.exchangeEligible === 'Yes' ? 'eligible' : 'not-eligible'}`}>
              {product.exchangeEligible}
            </span>
          </div>
        </div>

        <div className="product-status">
          <span className={`status-badge ${product.isPublished ? 'published' : 'unpublished'}`}>
            {product.isPublished ? 'Published' : 'Unpublished'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;