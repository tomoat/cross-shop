// 忽略Vite客户端路径的中间件
import { defineEventHandler, getRequestURL } from 'h3';
import type { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  const url = getRequestURL(event);
  
  // 对于以/@vite/client开头的请求，直接返回，避免Vue Router尝试匹配
  if (url.pathname.startsWith('/@vite/client')) {
    // 这些请求由Vite内部处理，不需要Vue Router干预
    return;
  }
  
  // 其他请求继续正常处理
  return;
});