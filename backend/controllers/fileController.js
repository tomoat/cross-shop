import path from 'path';
import fs from 'fs';
import { deleteFile as deleteFileFromUpload } from '../middleware/upload.js';

// @desc    上传产品图片
// @route   POST /api/files/products
// @access  Private (Seller/Admin)
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }
    
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/products/${file.filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.status(200).json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    res.status(500).json({ message: '上传图片失败', error: error.message });
  }
};

// @desc    上传用户头像
// @route   POST /api/files/avatar
// @access  Private
export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的头像' });
    }
    
    const uploadedFile = {
      filename: req.file.filename,
      path: `/uploads/avatars/${req.file.filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };
    
    res.status(200).json({
      success: true,
      file: uploadedFile
    });
  } catch (error) {
    res.status(500).json({ message: '上传头像失败', error: error.message });
  }
};

// @desc    删除文件
// @route   DELETE /api/files/:type/:filename
// @access  Private (Seller/Admin for products, User for their own files)
export const deleteFile = async (req, res) => {
  try {
    const { type, filename } = req.params;
    const validTypes = ['products', 'avatars', 'general'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: '无效的文件类型' });
    }
    
    // 构建文件路径
    const filePath = path.join(__dirname, `../uploads/${type}/${filename}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: '文件不存在' });
    }
    
    // 删除文件
    const success = deleteFileFromUpload(filePath);
    
    if (success) {
      res.status(200).json({ success: true, message: '文件已删除' });
    } else {
      res.status(500).json({ message: '删除文件失败' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除文件时发生错误', error: error.message });
  }
};

// @desc    获取上传目录中的文件列表
// @route   GET /api/files/:type
// @access  Private (Admin)
export const getFileList = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['products', 'avatars', 'general'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: '无效的文件类型' });
    }
    
    const dirPath = path.join(__dirname, `../uploads/${type}`);
    
    // 检查目录是否存在
    if (!fs.existsSync(dirPath)) {
      return res.status(200).json({ success: true, files: [] });
    }
    
    // 读取目录中的文件
    const files = fs.readdirSync(dirPath).map(filename => {
      const stats = fs.statSync(path.join(dirPath, filename));
      return {
        filename,
        path: `/uploads/${type}/${filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${type}/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });
    
    res.status(200).json({
      success: true,
      count: files.length,
      files
    });
  } catch (error) {
    res.status(500).json({ message: '获取文件列表失败', error: error.message });
  }
};