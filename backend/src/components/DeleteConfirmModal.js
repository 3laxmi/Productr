import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ product, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Product</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="warning-icon">⚠️</div>
          <p>
            Are you sure you want to delete <strong>"{product.name}"</strong>?
          </p>
          <p className="warning-text">
            This action cannot be undone. The product will be permanently removed from your inventory.
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;