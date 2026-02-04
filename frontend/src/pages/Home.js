import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [unpublishedProducts, setUnpublishedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [publishedRes, unpublishedRes] = await Promise.all([
        productsAPI.getPublished(),
        productsAPI.getUnpublished()
      ]);
      
      setPublishedProducts(publishedRes.data);
      setUnpublishedProducts(unpublishedRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = () => {
    fetchProducts();
  };

  const currentProducts = activeTab === 'published' ? publishedProducts : unpublishedProducts;

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-tabs">
        <button 
          className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          Published ({publishedProducts.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'unpublished' ? 'active' : ''}`}
          onClick={() => setActiveTab('unpublished')}
        >
          Unpublished ({unpublishedProducts.length})
        </button>
      </div>

      <div className="home-content">
        {currentProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>
              {activeTab === 'published' 
                ? 'No Published Products' 
                : 'No Unpublished Products'
              }
            </h3>
            <p>
              {activeTab === 'published' 
                ? 'Publish your products to see them here' 
                : 'Create new products or unpublish existing ones to see them here'
              }
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {currentProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onUpdate={handleProductUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;