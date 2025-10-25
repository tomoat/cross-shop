import { useContext } from 'react';
import AuthContext from './AuthContext';

// 自定义钩子，方便在组件中使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  
  return context;
};

export default useAuth;