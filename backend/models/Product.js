import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请提供产品名称'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '请提供产品描述']
  },
  price: {
    type: Number,
    required: [true, '请提供产品价格']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'CNY', 'EUR', 'GBP', 'JPY']
  },
  originalPrice: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [
    {
      url: String,
      alt: String,
      isMain: Boolean
    }
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: String,
  attributes: [
    {
      name: String,
      value: String
    }
  ],
  shippingInfo: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: Boolean
  },
  internationalShipping: {
    type: Boolean,
    default: false
  },
  shippingCountries: [String],
  taxInfo: {
    taxRate: Number,
    isTaxIncluded: Boolean
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 计算平均评分的中间件
ProductSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Product', ProductSchema);