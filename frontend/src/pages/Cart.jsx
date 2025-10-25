import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Typography, Tag, Row, Col, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../utils/api';

const { Title, Text } = Typography;

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getCart();
          setCart(data);
        } catch (error) {
          message.error('获取购物车失败');
          console.error('获取购物车失败:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart(null);
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const handleQuantityChange = async (itemId, change) => {
    if (!cart) return;

    const item = cart.items.find(i => i._id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    const maxQuantity = item.product.variants?.find(v => v._id === item.variant)?.stock || item.product.stock;

    if (newQuantity < 1 || newQuantity > maxQuantity) return;

    try {
      setUpdating(true);
      await updateCartItem(itemId, { quantity: newQuantity });
      // 刷新购物车
      const updatedCart = await getCart();
      setCart(updatedCart);
      message.success('数量已更新');
    } catch (error) {
      message.error('更新数量失败');
      console.error('更新购物车项失败:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdating(true);
      await removeCartItem(itemId);
      // 刷新购物车
      const updatedCart = await getCart();
      setCart(updatedCart);
      message.success('商品已移除');
    } catch (error) {
      message.error('移除商品失败');
      console.error('移除购物车项失败:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setUpdating(true);
      await clearCart();
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      message.success('购物车已清空');
    } catch (error) {
      message.error('清空购物车失败');
      console.error('清空购物车失败:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    if (!cart || cart.items.length === 0) {
      message.warning('购物车为空');
      return;
    }
    window.location.href = '/checkout';
  };

  const columns = [
    {
      title: '商品信息',
      key: 'product',
      render: (text, record) => {
        const product = record.product;
        const variant = product.variants?.find(v => v._id === record.variant);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }}
            />
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{product.name}</div>
              {variant && (
                <Tag color="blue" style={{ marginBottom: 4 }}>{variant.name}</Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: '单价',
      key: 'price',
      render: (text, record) => {
        const product = record.product;
        const variant = product.variants?.find(v => v._id === record.variant);
        const price = variant?.price || product.price;
        return <Text type="danger">¥{price.toFixed(2)}</Text>;
      },
    },
    {
      title: '数量',
      key: 'quantity',
      render: (text, record) => {
        const product = record.product;
        const variant = product.variants?.find(v => v._id === record.variant);
        const maxQuantity = variant?.stock || product.stock;
        const isInStock = maxQuantity > 0;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              icon={<MinusOutlined />}
              onClick={() => handleQuantityChange(record._id, -1)}
              disabled={record.quantity <= 1 || !isInStock || updating}
              size="small"
            />
            <div style={{ width: 40, textAlign: 'center' }}>{record.quantity}</div>
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleQuantityChange(record._id, 1)}
              disabled={record.quantity >= maxQuantity || !isInStock || updating}
              size="small"
            />
            {!isInStock && (
              <Tag color="red" style={{ marginLeft: 8 }}>缺货</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (text, record) => {
        const product = record.product;
        const variant = product.variants?.find(v => v._id === record.variant);
        const price = variant?.price || product.price;
        const subtotal = price * record.quantity;
        return <Text type="danger" style={{ fontWeight: 'bold' }}>¥{subtotal.toFixed(2)}</Text>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record._id)}
          loading={updating}
        >
          删除
        </Button>
      ),
    },
  ];

  const hasItems = cart && cart.items && cart.items.length > 0;

  return (
    <div className="container" style={{ padding: '24px' }}>
      <Title level={4}>购物车</Title>
      
      {!user ? (
        <Card style={{ marginTop: '16px', textAlign: 'center', padding: '48px 24px' }}>
          <ShoppingCartOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <Text style={{ fontSize: '16px', marginBottom: '24px', display: 'block' }}>请先登录查看购物车</Text>
          <Button type="primary" onClick={() => window.location.href = '/login'}>
            立即登录
          </Button>
        </Card>
      ) : (
        <>
          <Card style={{ marginTop: '16px', marginBottom: '24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>加载中...</div>
            ) : hasItems ? (
              <>
                <Table
                  columns={columns}
                  dataSource={cart.items}
                  rowKey="_id"
                  pagination={false}
                  loading={updating}
                />
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                  <Button danger onClick={handleClearCart} loading={updating}>
                    清空购物车
                  </Button>
                </div>
              </>
            ) : (
              <Empty
                description="购物车为空"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '48px 0' }}
              />
            )}
          </Card>

          {hasItems && (
            <Card style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', borderTop: '1px solid #f0f0f0' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={12}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <Text style={{ fontSize: '16px' }}>共 {cart.totalItems} 件商品</Text>
                    <Text style={{ fontSize: '16px' }}>合计:</Text>
                    <Text type="danger" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      ¥{cart.totalAmount.toFixed(2)}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                  <Button type="primary" size="large" onClick={handleCheckout} loading={updating}>
                    去结算
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;