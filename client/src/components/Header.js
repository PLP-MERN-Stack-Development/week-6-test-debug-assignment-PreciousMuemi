import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Task Manager</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Tasks</Link>
          <Link to="/tasks/new" className="nav-link">New Task</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 