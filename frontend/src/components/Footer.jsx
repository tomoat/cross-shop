import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <div className="footer-section">
              <h3 className="footer-title">关于我们</h3>
              <p className="footer-text">
                跨境商城是专业的跨国电商平台，致力于为全球消费者提供优质的商品和服务。
              </p>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="footer-section">
              <h3 className="footer-title">快速链接</h3>
              <ul className="footer-links">
                <li><Link to="/">首页</Link></li>
                <li><Link to="/products">商品列表</Link></li>
                <li><Link to="/profile">个人中心</Link></li>
                <li><Link to="/orders">我的订单</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="footer-section">
              <h3 className="footer-title">客户服务</h3>
              <ul className="footer-links">
                <li>帮助中心</li>
                <li>联系我们</li>
                <li>配送信息</li>
                <li>退换政策</li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="footer-section">
              <h3 className="footer-title">联系我们</h3>
              <ul className="footer-contact">
                <li>邮箱：support@cross-shop.com</li>
                <li>电话：+86 123 4567 8901</li>
                <li>地址：中国上海市浦东新区</li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} 跨境商城. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;