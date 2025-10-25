#!/bin/bash

# 启动Fastify服务器脚本

echo "Starting Cross-Shop Fastify Backend..."

# 检查环境变量文件是否存在
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  echo "Please create .env file based on the example."
  exit 1
fi

# 启动服务器
npm run dev