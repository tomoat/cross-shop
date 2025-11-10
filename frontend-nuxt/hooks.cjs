// 全局控制台拦截器 - 这是一个CommonJS模块，会在Nuxt应用启动前加载

// 保存原始的console.warn方法
const originalWarn = console.warn;

// 重写console.warn方法
console.warn = function() {
  // 检查警告信息是否包含Vue Router关于Vite路径的警告
  const args = Array.from(arguments);
  const isViteRouterWarning = args.some(arg => {
    return typeof arg === 'string' && 
           arg.includes('[Vue Router warn]') && 
           (arg.includes('/@vite/client') || 
            arg.includes('/__vite_ping') || 
            arg.includes('/@id/'));
  });
  
  // 如果不是Vite相关的Router警告，则正常显示
  if (!isViteRouterWarning) {
    originalWarn.apply(console, args);
  }
};

// 也重写process.stdout.write，以防警告通过这个方法输出
const originalStdoutWrite = process.stdout.write;
process.stdout.write = function() {
  const args = Array.from(arguments);
  if (args[0] && typeof args[0] === 'string') {
    // 检查是否包含Vite路径的警告
    const isViteRouterWarning = args[0].includes('[Vue Router warn]') && 
                               (args[0].includes('/@vite/client') || 
                                args[0].includes('/__vite_ping') || 
                                args[0].includes('/@id/'));
    
    if (!isViteRouterWarning) {
      return originalStdoutWrite.apply(process.stdout, args);
    }
    return true; // 不输出警告
  }
  return originalStdoutWrite.apply(process.stdout, args);
};