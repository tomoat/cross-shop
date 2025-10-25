import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, '请提供收件人姓名']
  },
  phone: {
    type: String,
    required: [true, '请提供联系电话']
  },
  country: {
    type: String,
    required: [true, '请提供国家/地区']
  },
  province: {
    type: String,
    required: [true, '请提供省/州']
  },
  city: {
    type: String,
    required: [true, '请提供城市']
  },
  district: String,
  street: {
    type: String,
    required: [true, '请提供街道地址']
  },
  postalCode: {
    type: String,
    required: [true, '请提供邮政编码']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 当设置一个地址为默认地址时，自动将其他地址设置为非默认
AddressSchema.pre('save', async function(next) {
  if (this.isModified('isDefault') && this.isDefault) {
    await this.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Address', AddressSchema);