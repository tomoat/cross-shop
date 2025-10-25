import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Radio, Divider, message, Select, Row, Col, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getCart, createOrder, getAddresses, addAddress } from '../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate('/login');
        message.warning('请先登录');
        return;
      }

      try {
        setLoading(true);
        // 获取购物车和地址信息
        const [cartData, addressesData] = await Promise.all([
          getCart(),
          getAddresses()
        ]);

        setCart(cartData);
        setAddresses(addressesData);
        
        // 如果有地址，默认选择第一个
        if (addressesData.length > 0) {
          setSelectedAddress(addressesData[0]._id);
        }
        
        // 如果购物车为空，跳转到购物车页面
        if (!cartData.items || cartData.items.length === 0) {
          navigate('/cart');
          message.warning('购物车为空，请先添加商品');
        }
      } catch (error) {
        message.error('获取数据失败');
        console.error('获取结算数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      message.warning('请选择收货地址');
      return;
    }

    try {
      setSubmitting(true);
      const orderData = {
        addressId: selectedAddress,
        paymentMethod
      };

      const order = await createOrder(orderData);
      message.success('订单创建成功');
      
      // 跳转到订单详情页
      navigate(`/orders/${order._id}`);
    } catch (error) {
      message.error('订单创建失败');
      console.error('创建订单失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNewAddress = async () => {
    // 简单验证
    if (!newAddress.name || !newAddress.phone || !newAddress.province || !newAddress.city || !newAddress.district || !newAddress.detail) {
      message.warning('请填写完整地址信息');
      return;
    }

    try {
      const address = await addAddress(newAddress);
      setAddresses([...addresses, address]);
      setSelectedAddress(address._id);
      setShowNewAddressForm(false);
      setNewAddress({
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: ''
      });
      message.success('地址添加成功');
    } catch (error) {
      message.error('地址添加失败');
      console.error('添加地址失败:', error);
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '24px', textAlign: 'center' }}>
        <p>加载中...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '24px' }}>
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <Empty description="购物车为空" />
          <Button type="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>
            去购物
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px' }}>
      <Title level={4}>结算</Title>
      
      <Card style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Title level={5}>收货地址</Title>
        
        {addresses.length > 0 && !showNewAddressForm ? (
          <Radio.Group value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {addresses.map((address) => (
                <Radio key={address._id} value={address._id} style={{ width: '100%' }}>
                  <div style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Text strong>{address.name}</Text>
                      <Text>{address.phone}</Text>
                    </div>
                    <Text>
                      {address.province} {address.city} {address.district} {address.detail}
                    </Text>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        ) : (
          showNewAddressForm ? (
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item label="收货人">
                    <Input
                      name="name"
                      value={newAddress.name}
                      onChange={handleAddressChange}
                      placeholder="请输入收货人姓名"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="手机号码">
                    <Input
                      name="phone"
                      value={newAddress.phone}
                      onChange={handleAddressChange}
                      placeholder="请输入手机号码"
                      type="tel"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item label="省份">
                    <Input
                      name="province"
                      value={newAddress.province}
                      onChange={handleAddressChange}
                      placeholder="请输入省份"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="城市">
                    <Input
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      placeholder="请输入城市"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="区县">
                    <Input
                      name="district"
                      value={newAddress.district}
                      onChange={handleAddressChange}
                      placeholder="请输入区县"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="详细地址">
                <Input.TextArea
                  name="detail"
                  value={newAddress.detail}
                  onChange={handleAddressChange}
                  placeholder="请输入详细地址"
                  rows={3}
                />
              </Form.Item>
              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <Button onClick={() => setShowNewAddressForm(false)} style={{ marginRight: '8px' }}>
                  取消
                </Button>
                <Button type="primary" onClick={handleAddNewAddress}>
                  添加地址
                </Button>
              </div>
            </Form>
          ) : (
            <Empty description="暂无收货地址" style={{ padding: '24px 0' }} />
          )
        )}
        
        {addresses.length > 0 && !showNewAddressForm && (
          <Button type="dashed" onClick={() => setShowNewAddressForm(true)} style={{ width: '100%', marginTop: '16px' }}>
            + 添加新地址
          </Button>
        )}
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <Title level={5}>支付方式</Title>
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Radio value="online">在线支付</Radio>
          <Radio value="cod">货到付款</Radio>
        </Radio.Group>
      </Card>

      <Card style={{ marginBottom: '16px' }}>
        <Title level={5}>订单详情</Title>
        {cart.items.map((item, index) => {
          const product = item.product;
          const variant = product.variants?.find(v => v._id === item.variant);
          const price = variant?.price || product.price;
          const subtotal = price * item.quantity;
          
          return (
            <div key={item._id} style={{ display: 'flex', marginBottom: '16px', paddingBottom: '16px', borderBottom: index < cart.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 16 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px' }}>{product.name}</div>
                {variant && (
                  <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>{variant.name}</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="danger">¥{price.toFixed(2)}</Text>
                  <Text>x{item.quantity}</Text>
                </div>
              </div>
              <div style={{ marginLeft: 16, fontWeight: 'bold' }}>¥{subtotal.toFixed(2)}</div>
            </div>
          );
        })}
        
        <Divider />
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '8px' }}>
            <Text>商品总价: </Text>
            <Text type="danger">¥{cart.totalAmount.toFixed(2)}</Text>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Text>运费: </Text>
            <Text>¥0.00</Text>
          </div>
          <div style={{ fontSize: '16px', marginTop: '16px' }}>
            <Text>应付金额: </Text>
            <Text type="danger" style={{ fontSize: '20px', fontWeight: 'bold' }}>¥{cart.totalAmount.toFixed(2)}</Text>
          </div>
        </div>
      </Card>

      <div style={{ textAlign: 'right', padding: '16px', backgroundColor: '#fff', position: 'sticky', bottom: 0, borderTop: '1px solid #f0f0f0' }}>
        <Button type="primary" size="large" onClick={handleSubmitOrder} loading={submitting}>
          提交订单
        </Button>
      </div>
    </div>
  );
};

// 引入必要的组件
import { Space } from 'antd';
import { InputNumber } from 'antd';

export default Checkout;