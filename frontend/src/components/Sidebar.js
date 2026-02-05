import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Productr</h1>
      </div>
      
      <div className="sidebar-search">
        <input 
          type="text" 
          placeholder="Search..." 
          className="sidebar-search-input"
        />
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard/home" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          Home
        </NavLink>
        
        <NavLink 
          to="/dashboard/products" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">📦</span>
          Products
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;