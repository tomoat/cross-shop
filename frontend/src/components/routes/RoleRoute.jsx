import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

// 角色路由组件
const RoleRoute = ({ roles, children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>加载中...</div>;
  }
  
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default RoleRoute;