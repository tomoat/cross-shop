import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 用户注册
const registerUser = async (request, reply) => {
  try {
    const { username, email, password } = request.body;
    
    // 检查用户是否已存在
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return reply.status(400).send({ message: '用户名或邮箱已被使用' });
    }
    
    // 创建新用户
    const user = await User.create({
      username,
      email,
      password
    });
    
    if (user) {
      reply.status(201).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      reply.status(400).send({ message: '无效的用户数据' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 用户登录
const loginUser = async (request, reply) => {
  try {
    const { email, password } = request.body;
    
    // 查找用户
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      reply.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      reply.status(401).send({ message: '邮箱或密码错误' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取当前用户信息
const getMe = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id).select('-password');
    
    if (user) {
      reply.send(user);
    } else {
      reply.status(404).send({ message: '用户不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 更新用户信息
const updateUser = async (request, reply) => {
  try {
    const { username, avatar } = request.body;
    
    const user = await User.findById(request.user.id);
    
    if (user) {
      // 检查用户名是否被其他用户使用
      if (username && username !== user.username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
          return reply.status(400).send({ message: '用户名已被使用' });
        }
        user.username = username;
      }
      
      if (avatar) {
        user.avatar = avatar;
      }
      
      const updatedUser = await user.save();
      
      reply.send({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id)
      });
    } else {
      reply.status(404).send({ message: '用户不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 更改密码
const changePassword = async (request, reply) => {
  try {
    const { oldPassword, newPassword } = request.body;
    
    const user = await User.findById(request.user.id);
    
    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      
      reply.send({ message: '密码更新成功' });
    } else {
      reply.status(401).send({ message: '旧密码错误' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 获取所有用户（管理员）
const getUsers = async (request, reply) => {
  try {
    const users = await User.find({}).select('-password');
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

// 删除用户（管理员）
const deleteUser = async (request, reply) => {
  try {
    const user = await User.findById(request.params.id);
    
    if (user) {
      await user.remove();
      reply.send({ message: '用户删除成功' });
    } else {
      reply.status(404).send({ message: '用户不存在' });
    }
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  changePassword,
  getUsers,
  deleteUser
};