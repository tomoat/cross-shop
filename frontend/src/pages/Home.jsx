import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Carousel } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { productAPI, categoryAPI } from "../utils/api";
import "../styles/Home.css";

const { Title, Text } = Typography;
const { Meta } = Card;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    // 获取热门产品
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getProducts({
          limit: 8,
          sort: "salesCount",
          order: "desc",
        });
        if (response.success) {
          setFeaturedProducts(response.products);
        } else {
          console.error("获取产品失败:", response.message);
        }
      } catch (error) {
        console.error("获取产品失败:", error);
      } finally {
        setLoading(false);
      }
    };

    // 获取分类数据
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        if (response.success) {
          setCategories(response.categories);
        } else {
          console.error("获取分类失败:", response.message);
        }
      } catch (error) {
        console.error("获取分类失败:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  // 轮播图数据
  const carouselItems = [
    {
      image: "https://via.placeholder.com/1200x400?text=跨境特惠",
      title: "跨境购物季",
      description: "全球好物，一站购齐",
      link: "/products",
    },
    {
      image: "https://via.placeholder.com/1200x400?text=新品上架",
      title: "新品推荐",
      description: "最新潮流单品",
      link: "/products",
    },
    {
      image: "https://via.placeholder.com/1200x400?text=限时优惠",
      title: "限时折扣",
      description: "精选商品低至5折",
      link: "/products",
    },
  ];

  // 默认分类图标映射
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "电子产品": "💻",
      "服装鞋帽": "👔",
      "美妆护肤": "💄",
      "家居生活": "🏠",
      "食品保健": "🍎",
      "母婴用品": "🍼",
      "运动户外": "⚽",
      "图书文具": "📚",
      "默认": "🛍️"
    };
    return iconMap[categoryName] || iconMap["默认"];
  };

  return (
    <div className="home-container">
      {/* 轮播图 */}
      <div className="hero-section">
        <Carousel autoplay className="home-carousel">
          {carouselItems.map((item, index) => (
            <div key={index} className="carousel-item">
              <img
                src={item.image}
                alt={item.title}
                className="carousel-image"
              />
              <div className="carousel-content">
                <Title level={2} className="carousel-title">
                  {item.title}
                </Title>
                <Text className="carousel-description">{item.description}</Text>
                <Button type="primary" size="large" className="carousel-button">
                  <Link to={item.link}>立即查看</Link>
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 分类导航 */}
      <div className="categories-section">
        <Title level={3} className="section-title">
          热门分类
        </Title>
        <Row gutter={[16, 16]} className="categories-grid">
          {categoriesLoading ? (
            // 分类加载骨架屏
            Array(8).fill(0).map((_, index) => (
              <Col xs={6} sm={4} md={3} key={`category-skeleton-${index}`}>
                <div className="category-item skeleton">
                  <div className="skeleton-icon skeleton-animate"></div>
                  <div className="skeleton-text skeleton-animate"></div>
                  <div className="skeleton-text small skeleton-animate"></div>
                </div>
              </Col>
            ))
          ) : categories.length > 0 ? (
            categories.map(category => (
              <Col xs={6} sm={4} md={3} key={category._id}>
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="category-item"
                >
                  <div className="category-icon">{getCategoryIcon(category.name)}</div>
                  <div className="category-name">{category.name}</div>
                  <div className="category-count">{category.productCount || 0}件商品</div>
                </Link>
              </Col>
            ))
          ) : (
            <Col span={24} className="no-categories">
              <Text>暂无分类数据</Text>
            </Col>
          )}
        </Row>
      </div>

      {/* 热门产品 */}
      <div className="products-section">
        <div className="section-header">
          <Title level={3} className="section-title">
            热门商品
          </Title>
          <Link to="/products" className="view-more">
            查看全部
          </Link>
        </div>

        <Row gutter={[16, 16]} className="products-grid">
          {loading ? (
            // 加载状态 - 显示骨架屏
            Array(8).fill(0).map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
                <Card className="product-card product-skeleton">
                  <div className="skeleton-image skeleton-animate"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title skeleton-animate"></div>
                    <div className="skeleton-price skeleton-animate"></div>
                  </div>
                </Card>
              </Col>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      className="product-image"
                    />
                  }
                  actions={[
                    <Link
                      to={`/cart/items/add?productId=${product._id}`}
                      key="add-to-cart"
                    >
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        size="small"
                      >
                        加入购物车
                      </Button>
                    </Link>,
                  ]}
                  className="product-card"
                >
                  <Meta
                    title={
                      <Link
                        to={`/product/${product._id}`}
                        className="product-name"
                      >
                        {product.name}
                      </Link>
                    }
                    description={
                      <div className="product-info">
                        <div className="product-price">${product.price}</div>
                        <div className="product-rating">
                          ⭐ {product.averageRating || 0}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))
          ) : (
            //{/* 无产品数据时显示提示 */}
            <Col span={24} className="no-products">
              <Empty description="暂无热门商品数据" />
            </Col>
          )}
        </Row>
      </div>

      {/* 特色服务 */}
      <div className="features-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6} className="feature-item">
            <div className="feature-icon">🌎</div>
            <div className="feature-content">
              <h4>全球直邮</h4>
              <p>商品直接从原产地发货</p>
            </div>
          </Col>
          <Col xs={24} md={6} className="feature-item">
            <div className="feature-icon">🛡️</div>
            <div className="feature-content">
              <h4>正品保障</h4>
              <p>所有商品100%正品</p>
            </div>
          </Col>
          <Col xs={24} md={6} className="feature-item">
            <div className="feature-icon">💰</div>
            <div className="feature-content">
              <h4>价格优势</h4>
              <p>享受全球最优价格</p>
            </div>
          </Col>
          <Col xs={24} md={6} className="feature-item">
            <div className="feature-icon">🎯</div>
            <div className="feature-content">
              <h4>售后无忧</h4>
              <p>7天无理由退换货</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
