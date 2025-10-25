import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Tag, List, Input, Rate, message, Avatar } from 'antd';
import { ShoppingCartOutlined, StarOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { getProductById, addReview, addToCart } from '../utils/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        message.error('获取产品信息失败');
        console.error('获取产品失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }

    try {
      await addToCart({
        productId: id,
        quantity,
        variantId: selectedVariant?.id
      });
      message.success('已添加到购物车');
    } catch (error) {
      message.error('添加到购物车失败');
      console.error('添加到购物车失败:', error);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }

    try {
      await addToCart({
        productId: id,
        quantity,
        variantId: selectedVariant?.id
      });
      // 跳转到结账页面
      window.location.href = '/checkout';
    } catch (error) {
      message.error('添加到购物车失败');
      console.error('添加到购物车失败:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }

    if (!reviewText.trim()) {
      message.warning('请填写评价内容');
      return;
    }

    try {
      setSubmittingReview(true);
      await addReview({
        productId: id,
        rating: reviewRating,
        comment: reviewText
      });
      message.success('评价提交成功');
      setReviewText('');
      // 刷新产品信息以显示新评价
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
    } catch (error) {
      message.error('评价提交失败');
      console.error('提交评价失败:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= (selectedVariant?.stock || product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '24px', textAlign: 'center' }}>
        <p>加载中...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '24px', textAlign: 'center' }}>
        <p>产品不存在</p>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const isInStock = currentStock > 0;

  return (
    <div className="container" style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div className="product-image" style={{ textAlign: 'center', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="product-image-thumbnails" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} - ${index + 1}`}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #f0f0f0', cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <div>
                <Title level={4} style={{ margin: 0 }}>{product.name}</Title>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  <Rate disabled defaultValue={product.averageRating || 0} />
                  <Text style={{ marginLeft: '8px' }}>({product.reviews?.length || 0} 评价)</Text>
                </div>
              </div>
            }
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="product-info">
              <div className="price-section" style={{ marginBottom: '16px' }}>
                <Text type="danger" style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{currentPrice.toFixed(2)}</Text>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <Text style={{ marginLeft: '8px', textDecoration: 'line-through', color: '#999' }}>¥{product.originalPrice.toFixed(2)}</Text>
                )}
              </div>

              <div className="stock-section" style={{ marginBottom: '16px' }}>
                <Text>{isInStock ? '有货' : '缺货'}</Text>
                <Text style={{ marginLeft: '8px', color: '#999' }}>库存: {currentStock} 件</Text>
              </div>

              {product.categories && product.categories.length > 0 && (
                <div className="categories-section" style={{ marginBottom: '16px' }}>
                  <Text>分类:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {product.categories.map((category, index) => (
                      <Tag key={index} color="blue">{category.name}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="variants-section" style={{ marginBottom: '16px' }}>
                  <Text>选择规格:</Text>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.variants.map((variant) => (
                      <Tag
                        key={variant.id}
                        color={selectedVariant?.id === variant.id ? 'blue' : 'default'}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {variant.name} - ¥{variant.price.toFixed(2)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <div className="quantity-section" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <Text style={{ marginRight: '16px' }}>数量:</Text>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  />
                  <Input
                    type="number"
                    min={1}
                    max={currentStock}
                    value={quantity}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      if (newVal > 0 && newVal <= currentStock) {
                        setQuantity(newVal);
                      }
                    }}
                    style={{ width: '80px', textAlign: 'center', borderLeft: 'none', borderRight: 'none' }}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock}
                  />
                </div>
              </div>

              <div className="action-buttons" style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  style={{ flex: 1 }}
                >
                  加入购物车
                </Button>
                <Button
                  danger
                  size="large"
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                  style={{ flex: 1 }}
                >
                  立即购买
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="商品详情" bordered={false} style={{ marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Paragraph>{product.description}</Paragraph>
            {product.details && (
              <div>
                {product.details.map((detail, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <Text strong>{detail.title}:</Text>
                    <Text>{detail.content}</Text>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="用户评价" bordered={false} style={{ marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="review-form" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
              <Title level={5}>发表评价</Title>
              <Rate value={reviewRating} onChange={setReviewRating} style={{ marginBottom: '12px' }} />
              <TextArea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="请输入您的评价..."
                style={{ marginBottom: '12px' }}
              />
              <Button type="primary" onClick={handleSubmitReview} loading={submittingReview}>
                提交评价
              </Button>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <List
                dataSource={product.reviews}
                renderItem={(review) => (
                  <List.Item className="review-item" style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <List.Item.Meta
                      avatar={<Avatar src={`https://ui-avatars.com/api/?name=${review.user?.username || 'Anonymous'}&background=random`} />}
                      title={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{review.user?.username || '匿名用户'}</span>
                        <div>
                          <Rate disabled defaultValue={review.rating} style={{ marginRight: '8px' }} />
                          <Text style={{ color: '#999' }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>}
                      description={<p style={{ marginTop: '8px' }}>{review.comment}</p>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text style={{ color: '#999' }}>暂无评价</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;