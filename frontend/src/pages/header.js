import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <header className="header">
      
      <h2><Link to="/dashboard" className="home">🐷 Quản lý trang trại</Link></h2>
      <nav className="nav">
        
        <Link to="/staffs">Nhân viên</Link>
      </nav>
    </header>
  );
};

export default Header;
