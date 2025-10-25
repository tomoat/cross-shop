import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h2>欢迎来到跨境商城</h2>
      <p style={{ marginBottom: '24px' }}>这是一个简化版的首页展示</p>
      
      {/* 简单的产品展示 */}
      <div style={{ marginBottom: '32px' }}>
        <h3>推荐产品</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {/* 模拟产品数据 */}
          {[1, 2, 3, 4].map(id => (
            <div key={id} style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ height: '200px', backgroundColor: '#f5f5f5', marginBottom: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>产品图片 {id}</span>
              </div>
              <h4>产品名称 {id}</h4>
              <p style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{id * 100}</p>
              <button style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                查看详情
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* 简单的服务介绍 */}
      <div>
        <h3>我们的服务</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
          <div style={{ flex: '1 1 200px', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h4>全球直邮</h4>
            <p>海外正品，直接发货</p>
          </div>
          <div style={{ flex: '1 1 200px', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h4>7天无理由退换</h4>
            <p>购物无忧，轻松退换</p>
          </div>
          <div style={{ flex: '1 1 200px', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px' }}>
            <h4>安全支付</h4>
            <p>多种支付方式，安全保障</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;