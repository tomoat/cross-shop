import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import '../styles/Auth.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await register(values.username, values.email, values.password);
      
      if (result.success) {
        message.success('注册成功');
        // 注册成功后跳转到首页
        navigate('/');
      } else {
        message.error(result.message || '注册失败');
        // 显示表单验证错误
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => {
            message.error(error.msg);
          });
        }
      }
    } catch {
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">用户注册</h1>
          <p className="auth-subtitle">创建您的账户，开始跨境购物之旅</p>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="auth-form"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度至少为3个字符' },
              { max: 20, message: '用户名长度不能超过20个字符' }
            ]}
            className="form-group"
          >
            <div className="form-input-container">
              <Input
                prefix={<UserOutlined className="form-input-icon" />}
                placeholder="请输入用户名"
                autoComplete="username"
                className="form-input"
              />
            </div>
          </Form.Item>
          
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
                prefix={<MailOutlined className="form-input-icon" />}
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
                autoComplete="new-password"
                className="form-input"
              />
            </div>
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
            className="form-group"
          >
            <div className="form-input-container">
              <Input.Password
                prefix={<LockOutlined className="form-input-icon" />}
                placeholder="请再次输入密码"
                autoComplete="new-password"
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
              注册
            </Button>
          </Form.Item>
          
          <div className="auth-switch">
            <span className="auth-switch-text">已有账户？</span>
            <Link to="/login" className="auth-switch-link">
              立即登录
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;