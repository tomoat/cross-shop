import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请输入产品名称'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '请输入产品描述']
  },
  price: {
    type: Number,
    required: [true, '请输入产品价格'],
    min: 0
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, '请输入产品数量'],
    min: 0
  },
  images: [{
    type: String,
    required: [true, '请上传产品图片']
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, '请选择产品分类']
  },
  brand: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新updatedAt字段
ProductSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;