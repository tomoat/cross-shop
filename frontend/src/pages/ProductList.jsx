import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Input, Select, Slider, Checkbox, Button, Tag, Empty, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getProducts, getCategories } from '../utils/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const ProductList = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: categoryId || '',
    priceRange: [0, 10000],
    sortBy: 'popularity',
    page: 1,
    pageSize: 12
  });
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(filters);
      setProducts(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('获取产品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handleCategoryChange = (value) => {
    setFilters(prev => ({
      ...prev,
      category: value,
      page: 1
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handlePriceRangeChange = (values) => {
    setFilters(prev => ({
      ...prev,
      priceRange: values,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleResetFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: '',
      category: categoryId || '',
      priceRange: [0, 10000],
      page: 1
    }));
  };



  const renderPagination = () => {
    const totalPages = Math.ceil(total / filters.pageSize);
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <Button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page - 1)}
          style={{ marginRight: '8px' }}
        >
          上一页
        </Button>
        {pages.map(page => (
          <Button
            key={page}
            type={filters.page === page ? 'primary' : 'default'}
            onClick={() => handlePageChange(page)}
            style={{ margin: '0 4px' }}
          >
            {page}
          </Button>
        ))}
        <Button
          disabled={filters.page === totalPages}
          onClick={() => handlePageChange(filters.page + 1)}
          style={{ marginLeft: '8px' }}
        >
          下一页
        </Button>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={4}>商品列表</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Search
            placeholder="搜索商品"
            onSearch={handleSearch}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder="按分类筛选"
            style={{ width: 180 }}
            value={filters.category}
            onChange={handleCategoryChange}
            allowClear
          >
            {categories.map(category => (
              <Option key={category._id} value={category._id}>{category.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="排序方式"
            style={{ width: 180 }}
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            <Option value="popularity">热门</Option>
            <Option value="priceAsc">价格从低到高</Option>
            <Option value="priceDesc">价格从高到低</Option>
            <Option value="newest">最新上架</Option>
          </Select>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
          >
            筛选
          </Button>
        </div>
        
        {showFilters && (
          <Card title="高级筛选" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>价格区间:</Text>
              <Slider
                range
                min={0}
                max={10000}
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                style={{ marginTop: '16px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>¥{filters.priceRange[0]}</Text>
                <Text>¥{filters.priceRange[1]}</Text>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleResetFilters}>重置</Button>
              <Button type="primary" onClick={() => setShowFilters(false)}>确定</Button>
            </div>
          </Card>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Text>共找到 {total} 件商品，当前第 {filters.page} 页，每页 {filters.pageSize} 件</Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 200, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        alt={product.name}
                        src={product.image || '/placeholder.jpg'}
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                      />
                    </div>
                  }
                  onClick={() => window.location.href = `/products/${product._id}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    {product.categories && product.categories.length > 0 && (
                      <Tag color="blue" style={{ fontSize: '12px' }}>{product.categories[0].name}</Tag>
                    )}
                    {product.discount && (
                      <Tag color="red" style={{ fontSize: '12px' }}>{product.discount}% OFF</Tag>
                    )}
                  </div>
                  <div style={{ marginBottom: '8px', height: 40, overflow: 'hidden' }}>
                    <Text ellipsis={{ rows: 2 }} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.name}
                    </Text>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text type="danger" style={{ fontWeight: 'bold', fontSize: '16px' }}>¥{product.price.toFixed(2)}</Text>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Text style={{ marginLeft: '8px', textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
                        ¥{product.originalPrice.toFixed(2)}
                      </Text>
                    )}
                  </div>
                  {product.averageRating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ color: '#faad14', fontSize: '14px', marginRight: '4px' }}>★★★★★</div>
                      <Text style={{ color: '#999', fontSize: '14px' }}>{product.averageRating}</Text>
                      <Text style={{ color: '#999', fontSize: '14px', marginLeft: '4px' }}>({product.reviews?.length || 0})</Text>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </>
      ) : (
        <Empty description="暂无商品" style={{ padding: '48px 0' }} />
      )}
    </div>
  );
};

export default ProductList;