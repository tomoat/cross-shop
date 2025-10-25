import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, List, Tag, Button, Divider, message, Empty, Steps, Timeline } from 'antd';
import { ArrowRightOutlined, CheckOutlined, ShoppingCartOutlined, TruckOutlined, HomeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getOrderById, cancelOrder, payOrder } from '../utils/api';
import { useAuth } from '../context/useAuth';

const { Title, Text, Paragraph } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        message.warning('请先登录');
        return;
      }

      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        message.error('获取订单详情失败');
        console.error('获取订单失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const handleCancelOrder = async () => {
    try {
      setActionLoading(true);
      await cancelOrder(id);
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
      message.success('订单已取消');
    } catch (error) {
      message.error('取消订单失败');
      console.error('取消订单失败:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayOrder = async () => {
    try {
      setActionLoading(true);
      await payOrder(id);
      // 这里可以跳转到支付页面或者模拟支付
      message.success('跳转到支付页面...');
      // 模拟支付成功
      setTimeout(async () => {
        const updatedOrder = await getOrderById(id);
        setOrder(updatedOrder);
        message.success('支付成功');
      }, 1000);
    } catch (error) {
      message.error('支付失败');
      console.error('支付失败:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      setActionLoading(true);
      // 这里应该调用确认收货的API
      message.success('已确认收货');
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
    } catch (error) {
      message.error('确认收货失败');
      console.error('确认收货失败:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getOrderStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: '待支付' },
      paid: { color: 'blue', text: '已支付' },
      shipped: { color: 'cyan', text: '已发货' },
      delivered: { color: 'green', text: '已送达' },
      cancelled: { color: 'gray', text: '已取消' },
      refunded: { color: 'red', text: '已退款' }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTimelineItems = (status) => {
    const timelineItems = [
      {
        title: '订单提交',
        icon: <ShoppingCartOutlined />,
        color: 'green',
        dot: <CheckOutlined />
      },
      {
        title: '订单支付',
        icon: <ClockCircleOutlined />,
        color: status === 'pending' ? 'orange' : (status !== 'cancelled' && status !== 'refunded' ? 'green' : 'gray'),
        dot: status !== 'pending' && status !== 'cancelled' && status !== 'refunded' ? <CheckOutlined /> : undefined
      },
      {
        title: '商品发货',
        icon: <TruckOutlined />,
        color: (status === 'shipped' || status === 'delivered') ? 'green' : 'gray',
        dot: (status === 'shipped' || status === 'delivered') ? <CheckOutlined /> : undefined
      },
      {
        title: '确认收货',
        icon: <HomeOutlined />,
        color: status === 'delivered' ? 'green' : 'gray',
        dot: status === 'delivered' ? <CheckOutlined /> : undefined
      }
    ];

    if (status === 'cancelled' || status === 'refunded') {
      timelineItems.push({
        title: status === 'cancelled' ? '订单取消' : '订单退款',
        icon: <ClockCircleOutlined />,
        color: status === 'cancelled' ? 'gray' : 'red',
        dot: <CheckOutlined />
      });
    }

    return timelineItems;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '24px', textAlign: 'center' }}>
        <p>加载中...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '24px', textAlign: 'center' }}>
        <Empty description="订单不存在" />
      </div>
    );
  }

  const canCancel = order.status === 'pending';
  const canPay = order.status === 'pending';
  const canConfirmDelivery = order.status === 'shipped';
  const canReview = order.status === 'delivered';

  return (
    <div className="container" style={{ padding: '24px' }}>
      <Title level={4}>订单详情</Title>
      
      {/* 订单状态跟踪 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <Text>订单号: {order._id}</Text>
          </div>
          <div>
            {getOrderStatusTag(order.status)}
          </div>
        </div>
        
        <Timeline
          items={getTimelineItems(order.status).map((item, index) => ({
            color: item.color,
            children: (
              <div>
                <Text strong>{item.title}</Text>
                {index === 0 && order.createdAt && (
                  <Text style={{ marginLeft: '8px', color: '#999' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </Text>
                )}
              </div>
            ),
            dot: item.dot || undefined
          }))}
        />
      </Card>

      {/* 收货地址 */}
      <Card title="收货信息" style={{ marginBottom: '24px' }}>
        <Descriptions column={1}>
          <Descriptions.Item label="收货人">{order.address.name}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{order.address.phone}</Descriptions.Item>
          <Descriptions.Item label="收货地址">
            {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 订单商品 */}
      <Card title="订单商品" style={{ marginBottom: '24px' }}>
        <List
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item
              key={item.product._id}
              style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}
            >
              <List.Item.Meta
                avatar={
                  <img
                    src={item.product.image || '/placeholder.jpg'}
                    alt={item.product.name}
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                }
                title={<a href={`/products/${item.product._id}`}>{item.product.name}</a>}
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      {item.variant && <Text style={{ color: '#999' }}>{item.variant.name}</Text>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Text type="danger">¥{item.price.toFixed(2)}</Text>
                      <Text>x{item.quantity}</Text>
                    </div>
                  </div>
                }
              />
              <div style={{ fontWeight: 'bold' }}>¥{(item.price * item.quantity).toFixed(2)}</div>
            </List.Item>
          )}
        />
        
        <div style={{ textAlign: 'right', paddingTop: '16px' }}>
          <div style={{ marginBottom: '8px' }}>
            <Text>商品总价: </Text>
            <Text type="danger">¥{order.totalAmount.toFixed(2)}</Text>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Text>运费: </Text>
            <Text>¥{order.shippingFee.toFixed(2)}</Text>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ fontSize: '16px' }}>
            <Text>实付金额: </Text>
            <Text type="danger" style={{ fontSize: '20px', fontWeight: 'bold' }}>
              ¥{(order.totalAmount + order.shippingFee).toFixed(2)}
            </Text>
          </div>
        </div>
      </Card>

      {/* 订单信息 */}
      <Card title="订单信息" style={{ marginBottom: '24px' }}>
        <Descriptions column={1}>
          <Descriptions.Item label="订单号">{order._id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="支付方式">
            {order.paymentMethod === 'online' ? '在线支付' : '货到付款'}
          </Descriptions.Item>
          {order.paymentTime && (
            <Descriptions.Item label="支付时间">{new Date(order.paymentTime).toLocaleString()}</Descriptions.Item>
          )}
          {order.shippingTime && (
            <Descriptions.Item label="发货时间">{new Date(order.shippingTime).toLocaleString()}</Descriptions.Item>
          )}
          {order.deliveryTime && (
            <Descriptions.Item label="送达时间">{new Date(order.deliveryTime).toLocaleString()}</Descriptions.Item>
          )}
          {order.trackingNumber && (
            <Descriptions.Item label="物流单号">{order.trackingNumber}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 操作按钮 */}
      <div style={{ textAlign: 'right', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
        {canCancel && (
          <Button danger onClick={handleCancelOrder} loading={actionLoading} style={{ marginRight: '8px' }}>
            取消订单
          </Button>
        )}
        {canPay && (
          <Button type="primary" onClick={handlePayOrder} loading={actionLoading} style={{ marginRight: '8px' }}>
            去支付
          </Button>
        )}
        {canConfirmDelivery && (
          <Button type="primary" onClick={handleConfirmDelivery} loading={actionLoading} style={{ marginRight: '8px' }}>
            确认收货
          </Button>
        )}
        {canReview && (
          <Button type="primary" onClick={() => window.location.href = `/products/${order.items[0].product._id}#reviews`} style={{ marginRight: '8px' }}>
            评价商品
          </Button>
        )}
        <Button onClick={() => window.location.href = '/profile?tab=orders'}>
          返回订单列表
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;