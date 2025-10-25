import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  List,
  Tag,
  Button,
  Avatar,
  Progress,
  Select,
} from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  BarChartOutlined,
  TrendingUpOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getDashboardStats, getRecentOrders } from "../../utils/api.js";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    // 检查用户是否是管理员
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData] = await Promise.all([
        getDashboardStats({ timeRange }),
        getRecentOrders({ limit: 5 }),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error("获取仪表板数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusTag = status => {
    const statusConfig = {
      pending: { color: "orange", text: "待支付" },
      paid: { color: "blue", text: "已支付" },
      shipped: { color: "cyan", text: "已发货" },
      delivered: { color: "green", text: "已送达" },
      cancelled: { color: "gray", text: "已取消" },
      refunded: { color: "red", text: "已退款" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 示例数据 - 实际应用中应从API获取
  const salesChartData = [
    { name: "周一", value: 1200 },
    { name: "周二", value: 1900 },
    { name: "周三", value: 1500 },
    { name: "周四", value: 2400 },
    { name: "周五", value: 2800 },
    { name: "周六", value: 3100 },
    { name: "周日", value: 2500 },
  ];

  const topCategories = [
    { name: "电子产品", value: 35 },
    { name: "服装鞋帽", value: 25 },
    { name: "家居用品", value: 20 },
    { name: "食品饮料", value: 15 },
    { name: "其他", value: 5 },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={4}>管理员仪表板</Title>
        <Select
          value={timeRange}
          onChange={setTimeRange}
          style={{ width: 120 }}
        >
          <Option value="day">今日</Option>
          <Option value="week">本周</Option>
          <Option value="month">本月</Option>
          <Option value="year">全年</Option>
        </Select>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
              suffix={
                <span
                  style={{
                    color: "green",
                    fontSize: "12px",
                    marginLeft: "8px",
                  }}
                >
                  <TrendingUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1677ff" }}
              suffix={
                <span
                  style={{
                    color: "green",
                    fontSize: "12px",
                    marginLeft: "8px",
                  }}
                >
                  <TrendingUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={stats.totalOrders}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#eb2f96" }}
              suffix={
                <span
                  style={{
                    color: "green",
                    fontSize: "12px",
                    marginLeft: "8px",
                  }}
                >
                  <TrendingUpOutlined /> 15%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总收入"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#f5222d" }}
              suffix={
                <span
                  style={{
                    color: "green",
                    fontSize: "12px",
                    marginLeft: "8px",
                  }}
                >
                  <TrendingUpOutlined /> 20%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 图表和数据 */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={16}>
          <Card title="销售趋势" style={{ height: "100%" }}>
            {/* 简化的销售图表表示 */}
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                paddingTop: "20px",
              }}
            >
              {salesChartData.map((item, index) => (
                <div key={index} style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      width: "30px",
                      margin: "0 auto",
                      backgroundColor: "#1890ff",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 1s",
                      height: `${
                        (item.value /
                          Math.max(...salesChartData.map(d => d.value))) *
                        200
                      }px`,
                    }}
                  />
                  <Text style={{ marginTop: "8px", display: "block" }}>
                    {item.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    ¥{item.value}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="分类销售占比" style={{ height: "100%" }}>
            <List
              dataSource={topCategories}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>{item.name}</Text>
                        <Text>{item.value}%</Text>
                      </div>
                    }
                    description={
                      <Progress percent={item.value} strokeColor="#1890ff" />
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近订单 */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24}>
          <Card title="最近订单" extra={<Button>查看全部</Button>}>
            {recentOrders.length > 0 ? (
              <List
                dataSource={recentOrders}
                renderItem={order => (
                  <List.Item
                    key={order._id}
                    actions={[
                      <Button size="small" key="view">
                        查看
                      </Button>,
                      <Button size="small" key="process">
                        处理
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar>
                          {order.user?.username?.charAt(0) || "U"}
                        </Avatar>
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Text>{order._id}</Text>
                          {getOrderStatusTag(order.status)}
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: "4px" }}>
                            <Text>
                              客户: {order.user?.username || "未知用户"}
                            </Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text>
                              商品数量:{" "}
                              {order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}
                            </Text>
                            <Text type="danger">
                              ¥{order.totalAmount.toFixed(2)}
                            </Text>
                          </div>
                          <div
                            style={{
                              marginTop: "4px",
                              display: "flex",
                              alignItems: "center",
                              color: "#999",
                            }}
                          >
                            <ClockCircleOutlined
                              style={{ marginRight: "4px", fontSize: "12px" }}
                            />
                            <Text style={{ fontSize: "12px" }}>
                              {new Date(order.createdAt).toLocaleString()}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "48px" }}>
                <Text>暂无最近订单</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Button
              type="primary"
              block
              style={{ height: "100%", padding: "24px 0" }}
            >
              添加商品
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Button
              type="default"
              block
              style={{ height: "100%", padding: "24px 0" }}
            >
              管理订单
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Button
              type="default"
              block
              style={{ height: "100%", padding: "24px 0" }}
            >
              用户管理
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Button
              type="default"
              block
              style={{ height: "100%", padding: "24px 0" }}
            >
              系统设置
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
