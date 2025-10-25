import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成随机文件名
const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = Date.now() + '_' + Math.round(Math.random() * 1E9);
  return name + ext;
};

// 创建Fastify兼容的上传中间件
const upload = {
  // 单个文件上传
  single: (fieldName) => {
    return async (request, reply) => {
      try {
        // 使用Fastify的multipart插件处理文件
        await request.parseMultipart();
        
        if (request.files && request.files[fieldName]) {
          const file = request.files[fieldName];
          
          // 验证文件类型
          const allowedTypes = /jpeg|jpg|png|gif|webp/;
          const extname = allowedTypes.test(path.extname(file.filename).toLowerCase());
          const mimetype = allowedTypes.test(file.mimetype);
          
          if (!extname || !mimetype) {
            return reply.status(400).send({ message: '只允许上传图片文件 (jpeg, jpg, png, gif, webp)' });
          }
          
          // 验证文件大小（5MB）
          if (file.file.length > 5 * 1024 * 1024) {
            return reply.status(400).send({ message: '文件大小不能超过5MB' });
          }
          
          // 生成随机文件名
          const newFilename = generateFileName(file.filename);
          
          // 保存文件信息
          file.newFilename = newFilename;
        }
        
        return reply.continue();
      } catch (error) {
        return reply.status(400).send({ message: error.message });
      }
    };
  },
  
  // 多个文件上传
  array: (fieldName, maxCount) => {
    return async (request, reply) => {
      try {
        await request.parseMultipart();
        
        // 处理逻辑类似single，但支持多个文件
        return reply.continue();
      } catch (error) {
        return reply.status(400).send({ message: error.message });
      }
    };
  }
};

// 获取上传文件的完整路径
const getUploadPath = (filename) => {
  return path.join(__dirname, '..', 'uploads', filename);
};

export { upload, getUploadPath };