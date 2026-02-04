import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setDeleteProduct(product);
  };

  const confirmDelete = async () => {
    try {
      await productsAPI.delete(deleteProduct._id);
      toast.success('Product deleted successfully');
      fetchProducts();
      setDeleteProduct(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    fetchProducts();
    handleModalClose();
  };

  const handleProductUpdate = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="products">
      {products.length === 0 ? (
        <div className="products-empty">
          <div className="empty-state">
            <div className="empty-icon">📦➕</div>
            <h3>Feels a little empty over here…</h3>
            <p>Add your first product to get started with your inventory management</p>
            <button className="btn btn-primary" onClick={handleAddProduct}>
              Add your Products
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="products-header">
            <h2>All Products ({products.length})</h2>
            <button className="btn btn-primary" onClick={handleAddProduct}>
              Add Product
            </button>
          </div>
          
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onUpdate={handleProductUpdate}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                showActions={true}
              />
            ))}
          </div>
        </>
      )}

      {showModal && (
        <ProductModal 
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleProductSaved}
        />
      )}

      {deleteProduct && (
        <DeleteConfirmModal 
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Products;