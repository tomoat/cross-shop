import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Avatar, List, Button, Empty, message, Tag, Modal, Form, Input, Upload } from 'antd';
import { UserOutlined, EditOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { getOrders, updateUserProfile, getFavoriteProducts, removeFavoriteProduct } from '../utils/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [ordersData, favoritesData] = await Promise.all([
        getOrders(),
        getFavoriteProducts()
      ]);
      setOrders(ordersData);
      setFavoriteProducts(favoritesData);
    } catch (error) {
      message.error('获取数据失败');
      console.error('获取个人中心数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || ''
      });
      setEditModalVisible(true);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      const updatedUser = await updateUserProfile(values);
      updateUser(updatedUser);
      setEditModalVisible(false);
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败');
      console.error('更新个人信息失败:', error);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await removeFavoriteProduct(productId);
      setFavoriteProducts(favoriteProducts.filter(p => p._id !== productId));
      message.success('已移除收藏');
    } catch (error) {
      message.error('移除失败');
      console.error('移除收藏失败:', error);
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

  if (!user) {
    return (
      <div className="container" style={{ padding: '24px', textAlign: 'center' }}>
        <Card style={{ padding: '48px' }}>
          <Text style={{ fontSize: '18px', marginBottom: '16px', display: 'block' }}>请先登录查看个人中心</Text>
          <Button type="primary" onClick={() => window.location.href = '/login'}>立即登录</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px' }}>
      <Title level={4}>个人中心</Title>
      
      {/* 用户基本信息卡片 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ marginRight: '24px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Title level={4} style={{ margin: 0, marginRight: '16px' }}>{user.username}</Title>
              {user.role === 'admin' && <Tag color="red">管理员</Tag>}
              {user.role === 'seller' && <Tag color="orange">商家</Tag>}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Text strong>邮箱: </Text>
              <Text>{user.email}</Text>
            </div>
            {user.phone && (
              <div style={{ marginBottom: '4px' }}>
                <Text strong>手机号: </Text>
                <Text>{user.phone}</Text>
              </div>
            )}
            {user.bio && (
              <div style={{ marginBottom: '8px' }}>
                <Text strong>简介: </Text>
                <Text>{user.bio}</Text>
              </div>
            )}
          </div>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEditProfile}>
            编辑资料
          </Button>
        </div>
      </Card>

      {/* 内容标签页 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><ShoppingOutlined /> 我的订单</span>} key="orders">
          {loading ? (
            <Card style={{ textAlign: 'center', padding: '48px' }}>加载中...</Card>
          ) : orders.length > 0 ? (
            <List
              dataSource={orders}
              renderItem={(order) => (
                <List.Item>
                  <Card
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>订单号: {order._id}</Text>
                        {getOrderStatusTag(order.status)}
                      </div>
                    }
                    style={{ width: '100%', marginBottom: '16px' }}
                  >
                    {order.items.map((item) => (
                      <div key={item.product._id} style={{ display: 'flex', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                        <img
                          src={item.product.image || '/placeholder.jpg'}
                          alt={item.product.name}
                          style={{ width: 60, height: 60, objectFit: 'cover', marginRight: '12px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: '4px' }}>{item.product.name}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="danger">¥{item.price.toFixed(2)}</Text>
                            <Text>x{item.quantity}</Text>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', paddingTop: '12px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Text>订单金额: </Text>
                        <Text type="danger" style={{ fontWeight: 'bold' }}>¥{order.totalAmount.toFixed(2)}</Text>
                      </div>
                      <Button onClick={() => window.location.href = `/orders/${order._id}`}>查看详情</Button>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Card style={{ textAlign: 'center', padding: '48px' }}>
              <Empty description="暂无订单" />
              <Button type="primary" style={{ marginTop: '16px' }} onClick={() => window.location.href = '/'}>
                去购物
              </Button>
            </Card>
          )}
        </TabPane>

        <TabPane tab={<span><HeartOutlined /> 我的收藏</span>} key="favorites">
          {loading ? (
            <Card style={{ textAlign: 'center', padding: '48px' }}>加载中...</Card>
          ) : favoriteProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {favoriteProducts.map((product) => (
                <Card
                  key={product._id}
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.image || '/placeholder.jpg'}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button danger onClick={() => handleRemoveFavorite(product._id)}>取消收藏</Button>
                  ]}
                  onClick={() => window.location.href = `/products/${product._id}`}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <Text type="danger" style={{ fontWeight: 'bold' }}>¥{product.price.toFixed(2)}</Text>
                        {product.averageRating > 0 && (
                          <div style={{ marginTop: '4px' }}>评分: {product.averageRating}</div>
                        )}
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ textAlign: 'center', padding: '48px' }}>
              <Empty description="暂无收藏商品" />
            </Card>
          )}
        </TabPane>

        <TabPane tab={<span><SettingOutlined /> 账户设置</span>} key="settings">
          <Card>
            <div style={{ marginBottom: '24px' }}>
              <Title level={5}>修改密码</Title>
              <Form layout="vertical">
                <Form.Item label="当前密码">
                  <Input.Password placeholder="请输入当前密码" />
                </Form.Item>
                <Form.Item label="新密码">
                  <Input.Password placeholder="请输入新密码" />
                </Form.Item>
                <Form.Item label="确认新密码">
                  <Input.Password placeholder="请再次输入新密码" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">修改密码</Button>
                </Form.Item>
              </Form>
            </div>
            
            <Divider />
            
            <div>
              <Title level={5}>安全设置</Title>
              <div style={{ marginBottom: '16px' }}>
                <Text>登录邮箱: {user.email}</Text>
                <Text style={{ color: 'gray', marginLeft: '8px' }}>已验证</Text>
              </div>
              {user.phone && (
                <div>
                  <Text>手机号码: {user.phone}</Text>
                  <Text style={{ color: 'gray', marginLeft: '8px' }}>已验证</Text>
                </div>
              )}
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* 编辑资料模态框 */}
      <Modal
        title="编辑个人资料"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" disabled />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item
            name="bio"
            label="个人简介"
          >
            <TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>
          
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setEditModalVisible(false)} style={{ marginRight: '8px' }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 引入必要的组件
import { Divider } from 'antd';

export default Profile;