import multer from '@koa/multer';
import fs from 'fs';
import path from 'path';

// 确保上传目录存在
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 产品图片上传配置
const productImageStorage = multer.diskStorage({
  destination: (ctx, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/products');
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (ctx, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const userId = ctx.state.user ? ctx.state.user._id : 'anonymous';
    cb(null, `${userId}-${uniqueSuffix}${fileExtension}`);
  }
});

// 用户头像上传配置
const userAvatarStorage = multer.diskStorage({
  destination: (ctx, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/avatars');
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (ctx, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const userId = ctx.state.user ? ctx.state.user._id : 'anonymous';
    cb(null, `${userId}-${uniqueSuffix}${fileExtension}`);
  }
});

// 通用文件上传配置
const generalStorage = multer.diskStorage({
  destination: (ctx, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/general');
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (ctx, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExtension}`);
  }
});

// 文件类型过滤器
const imageFilter = (ctx, file, cb) => {
  // 接受的图片MIME类型
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimeTypeValid = allowedTypes.test(file.mimetype);
  const extnameValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimeTypeValid && extnameValid) {
    return cb(null, true);
  } else {
    cb(new Error('只接受图片文件 (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

// 初始化上传中间件
const uploadProductImages = multer({
  storage: productImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // 最多10个文件
  },
  fileFilter: imageFilter
});

const uploadUserAvatar = multer({
  storage: userAvatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1 // 最多1个文件
  },
  fileFilter: imageFilter
});

const uploadGeneralFiles = multer({
  storage: generalStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // 最多10个文件
  }
});

// 删除文件的辅助函数
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error('删除文件失败:', error);
      return false;
    }
  }
  return false;
};

export {
  uploadProductImages,
  uploadUserAvatar,
  uploadGeneralFiles,
  deleteFile
};