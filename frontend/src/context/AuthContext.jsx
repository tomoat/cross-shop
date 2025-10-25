import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { userAPI } from "../utils/api";

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          // 解码token检查是否过期
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token已过期
            logout();
            return;
          }

          // 获取用户信息
          const response = await userAPI.getProfile();
          if (response.success) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error("认证检查失败:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录方法
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await userAPI.login({ email, password });

      if (response.success) {
        const { token, user } = response;

        // 保存token和用户信息到cookie
        Cookies.set("token", token, { expires: 30, path: "/" });
        Cookies.set("userInfo", JSON.stringify(user), {
          expires: 30,
          path: "/",
        });

        setUser(user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, message: response.message || "登录失败" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "登录失败，请稍后重试",
      };
    } finally {
      setLoading(false);
    }
  };

  // 注册方法
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await userAPI.register({ username, email, password });

      if (response.success) {
        const { token, user } = response;

        // 保存token和用户信息到cookie
        Cookies.set("token", token, { expires: 30, path: "/" });
        Cookies.set("userInfo", JSON.stringify(user), {
          expires: 30,
          path: "/",
        });

        setUser(user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "注册失败",
          errors: response.errors || [],
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "注册失败，请稍后重试",
        errors: error.errors || [],
      };
    } finally {
      setLoading(false);
    }
  };

  // 登出方法
  const logout = () => {
    // 清除cookie中的token和用户信息
    Cookies.remove("token");
    Cookies.remove("userInfo");

    // 重置状态
    setUser(null);
    setIsAuthenticated(false);

    // 跳转到登录页
    window.location.href = "/login";
  };

  // 更新用户信息
  const updateUser = userData => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
    // 同时更新cookie中的用户信息
    const updatedUser = { ...user, ...userData };
    Cookies.set("userInfo", JSON.stringify(updatedUser), {
      expires: 30,
      path: "/",
    });
  };

  // 检查用户角色
  const hasRole = roles => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // 提供给子组件的值
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
