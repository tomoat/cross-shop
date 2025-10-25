import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/routes/PrivateRoute';
import RoleRoute from '../components/routes/RoleRoute';

// 懒加载页面组件
const Home = React.lazy(() => import('../pages/Home.jsx'));
const ProductList = React.lazy(() => import('../pages/ProductList.jsx'));
const ProductDetail = React.lazy(() => import('../pages/ProductDetail.jsx'));
const Cart = React.lazy(() => import('../pages/Cart.jsx'));
const Checkout = React.lazy(() => import('../pages/Checkout.jsx'));
const OrderList = React.lazy(() => import('../pages/OrderList.jsx'));
const OrderDetail = React.lazy(() => import('../pages/OrderDetail.jsx'));
const Login = React.lazy(() => import('../pages/Login.jsx'));
const Register = React.lazy(() => import('../pages/Register.jsx'));
const Profile = React.lazy(() => import('../pages/Profile.jsx'));
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard.jsx'));
const AdminProducts = React.lazy(() => import('../pages/admin/Products.jsx'));
const AdminOrders = React.lazy(() => import('../pages/admin/Orders.jsx'));
const AdminUsers = React.lazy(() => import('../pages/admin/Users.jsx'));
const SellerDashboard = React.lazy(() => import('../pages/seller/Dashboard.jsx'));
const SellerProducts = React.lazy(() => import('../pages/seller/Products.jsx'));
const SellerOrders = React.lazy(() => import('../pages/seller/Orders.jsx'));
const NotFound = React.lazy(() => import('../pages/NotFound.jsx'));

// 公共路由
const publicRoutes = [
  { path: '/', element: <Home />, exact: true },
  { path: '/products', element: <ProductList /> },
  { path: '/product/:id', element: <ProductDetail /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/404', element: <NotFound /> },
  // 捕获所有未匹配的路由，重定向到404
  { path: '*', element: <Navigate to="/404" replace /> }
];

// 私有路由
const privateRoutes = [
  { path: '/cart', element: <PrivateRoute><Cart /></PrivateRoute> },
  { path: '/checkout', element: <PrivateRoute><Checkout /></PrivateRoute> },
  { path: '/orders', element: <PrivateRoute><OrderList /></PrivateRoute> },
  { path: '/order/:id', element: <PrivateRoute><OrderDetail /></PrivateRoute> },
  { path: '/profile', element: <PrivateRoute><Profile /></PrivateRoute> },
  
  // 管理员路由
  { 
    path: '/admin/dashboard', 
    element: <RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute> 
  },
  { 
    path: '/admin/products', 
    element: <RoleRoute roles={['admin']}><AdminProducts /></RoleRoute> 
  },
  { 
    path: '/admin/orders', 
    element: <RoleRoute roles={['admin']}><AdminOrders /></RoleRoute> 
  },
  { 
    path: '/admin/users', 
    element: <RoleRoute roles={['admin']}><AdminUsers /></RoleRoute> 
  },
  
  // 卖家路由
  { 
    path: '/seller/dashboard', 
    element: <RoleRoute roles={['seller', 'admin']}><SellerDashboard /></RoleRoute> 
  },
  { 
    path: '/seller/products', 
    element: <RoleRoute roles={['seller', 'admin']}><SellerProducts /></RoleRoute> 
  },
  { 
    path: '/seller/orders', 
    element: <RoleRoute roles={['seller', 'admin']}><SellerOrders /></RoleRoute> 
  }
];

// 合并所有路由
const allRoutes = [...publicRoutes, ...privateRoutes];

export { publicRoutes, privateRoutes, allRoutes };