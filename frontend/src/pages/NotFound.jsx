import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-decoration decoration-1"></div>
        <div className="not-found-decoration decoration-2"></div>
        
        <div className="not-found-number">404</div>
        <h1 className="not-found-title">页面不存在</h1>
        <p className="not-found-description">
          抱歉，您访问的页面不存在或已被移除。
          请检查您的链接或返回首页继续浏览。
        </p>
        
        <Link to="/" className="back-home-button">
          返回首页
        </Link>
        
        <div className="search-suggestion">
          <h3 className="suggestion-title">您可能想要访问：</h3>
          <div className="suggestion-links">
            <Link to="/" className="suggestion-link">首页</Link>
            <Link to="/products" className="suggestion-link">商品列表</Link>
            <Link to="/cart" className="suggestion-link">购物车</Link>
            <Link to="/login" className="suggestion-link">登录</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;