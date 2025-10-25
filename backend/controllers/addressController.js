import Address from '../models/Address.js';

// @desc    获取用户的所有地址
// @route   GET /api/addresses
// @access  Private
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ isDefault: -1, updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    获取单个地址详情
// @route   GET /api/addresses/:id
// @access  Private
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!address) {
      return res.status(404).json({ message: '地址不存在' });
    }
    
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    创建新地址
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
  try {
    // 输入验证已在路由层处理
    
    const { 
      fullName, phone, country, province, city, district, 
      street, postalCode, isDefault, addressType, notes 
    } = req.body;
    
    // 如果设置为默认地址，先将其他地址设置为非默认
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
      );
    } else {
      // 如果是用户的第一个地址，自动设置为默认
      const addressCount = await Address.countDocuments({ user: req.user._id });
      if (addressCount === 0) {
        isDefault = true;
      }
    }
    
    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      country,
      province,
      city,
      district,
      street,
      postalCode,
      isDefault,
      addressType,
      notes
    });
    
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    更新地址
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    
    const { 
      fullName, phone, country, province, city, district, 
      street, postalCode, isDefault, addressType, notes 
    } = req.body;
    
    let address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!address) {
      return res.status(404).json({ message: '地址不存在' });
    }
    
    // 如果设置为默认地址，先将其他地址设置为非默认
    if (isDefault !== undefined && isDefault) {
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }
    
    // 更新地址字段
    if (fullName !== undefined) address.fullName = fullName;
    if (phone !== undefined) address.phone = phone;
    if (country !== undefined) address.country = country;
    if (province !== undefined) address.province = province;
    if (city !== undefined) address.city = city;
    if (district !== undefined) address.district = district;
    if (street !== undefined) address.street = street;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (isDefault !== undefined) address.isDefault = isDefault;
    if (addressType !== undefined) address.addressType = addressType;
    if (notes !== undefined) address.notes = notes;
    
    address.updatedAt = Date.now();
    
    address = await address.save();
    
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    删除地址
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!address) {
      return res.status(404).json({ message: '地址不存在' });
    }
    
    // 记录是否为默认地址
    const wasDefault = address.isDefault;
    
    // 删除地址
    await address.remove();
    
    // 如果删除的是默认地址，且用户还有其他地址，则将最新添加的地址设为默认
    if (wasDefault) {
      const remainingAddresses = await Address.find({ user: req.user._id })
        .sort({ createdAt: -1 });
      
      if (remainingAddresses.length > 0) {
        remainingAddresses[0].isDefault = true;
        await remainingAddresses[0].save();
      }
    }
    
    res.status(200).json({ success: true, message: '地址已删除' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

// @desc    设置默认地址
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    // 查找地址并验证所有权
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!address) {
      return res.status(404).json({ message: '地址不存在' });
    }
    
    // 将所有地址设置为非默认
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );
    
    // 设置当前地址为默认
    address.isDefault = true;
    address.updatedAt = Date.now();
    await address.save();
    
    res.status(200).json({ 
      success: true, 
      message: '默认地址已设置',
      address
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};