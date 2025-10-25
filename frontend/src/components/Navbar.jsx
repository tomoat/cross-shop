import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Button, Badge, Dropdown, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DownOutlined, SearchOutlined, HomeOutlined, AppstoreOutlined, ShoppingOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  // 监听滚动事件
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 用户菜单配置
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>,
      icon: <UserOutlined />
    },
    {
      key: 'orders',
      label: <Link to="/orders">我的订单</Link>,
      icon: <ShoppingOutlined />
    },
    {
      key: 'cart',
      label: <Link to="/cart">购物车</Link>,
      icon: <ShoppingCartOutlined />
    },
    ...(hasRole(['admin']) ? [
      {
        type: 'divider'
      },
      {
        key: 'admin-dashboard',
        label: <Link to="/admin/dashboard">管理后台</Link>,
        icon: <SettingOutlined />
      }
    ] : []),
    ...(hasRole(['seller']) ? [
      {
        type: 'divider'
      },
      {
        key: 'seller-dashboard',
        label: <Link to="/seller/dashboard">卖家中心</Link>,
        icon: <SettingOutlined />
      }
    ] : []),
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: <span onClick={logout}>退出登录</span>,
      icon: <LogoutOutlined />
    }
  ];

  // 导航菜单配置
  const navMenuItems = [
    {
      key: 'home',
      label: <Link to="/" className="nav-link"><HomeOutlined /> 首页</Link>
    },
    {
      key: 'products',
      label: <Link to="/products" className="nav-link"><AppstoreOutlined /> 商品列表</Link>
    }
  ];

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <h1>跨境商城</h1>
          </Link>
          <Menu 
            mode="horizontal" 
            items={navMenuItems}
            className="nav-menu"
          />
        </div>
        
        <div className="navbar-right">
          {/* 搜索框 - 简化版 */}
          <div className="search-box">
            <Button 
              icon={<SearchOutlined />} 
              onClick={() => navigate('/products')}
              className="search-button"
            />
          </div>
          
          {/* 购物车图标 */}
          <Link to="/cart" className="cart-icon">
            <Badge count={0} showZero>
              <ShoppingCartOutlined />
            </Badge>
          </Link>
          
          {/* 用户相关 */}
          {isAuthenticated ? (
            <Dropdown 
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Button className="user-button">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="username">{user?.username}</span>
                <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <Button type="default">登录</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">注册</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;