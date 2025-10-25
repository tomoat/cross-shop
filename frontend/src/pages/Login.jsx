import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import '../styles/Auth.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await login(values.email, values.password);
      
      if (result.success) {
        message.success('登录成功');
        // 登录成功后跳转到首页
        navigate('/');
      } else {
        message.error(result.message || '登录失败');
      }
    } catch {
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">用户登录</h1>
          <p className="auth-subtitle">欢迎回来，请登录您的账户</p>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="auth-form"
        >
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
            className="form-group"
          >
            <div className="form-input-container">
              <Input
                prefix={<UserOutlined className="form-input-icon" />}
                placeholder="请输入邮箱地址"
                autoComplete="email"
                className="form-input"
              />
            </div>
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6个字符' }
            ]}
            className="form-group"
          >
            <div className="form-input-container">
              <Input.Password
                prefix={<LockOutlined className="form-input-icon" />}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="form-input"
              />
            </div>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="submit-button"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
          
          <div className="auth-switch">
            <span className="auth-switch-text">还没有账户？</span>
            <Link to="/register" className="auth-switch-link">
              立即注册
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;