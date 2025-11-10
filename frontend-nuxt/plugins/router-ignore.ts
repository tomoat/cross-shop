// 处理Vue Router警告的插件
import { defineNuxtPlugin } from 'nuxt/app';
import type { Router } from 'vue-router';
import type { NuxtApp } from 'nuxt/app';
import type { RouteLocationRaw, RouteLocationNormalizedLoaded, RouteLocation } from 'vue-router';

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  // 等待路由就绪
  nuxtApp.hooks.hook('vue:router:initialized', (router: Router) => {
    // 重写路由的匹配方法，忽略特定路径
    const originalMatch = router.matcher.match;
    
    router.matcher.match = (rawLocation: RouteLocationRaw, currentLocation?: RouteLocationNormalizedLoaded, redirectedFrom?: RouteLocation) => {
      const location = typeof rawLocation === 'string' ? rawLocation : (rawLocation as { path?: string }).path;
      
      // 忽略Vite客户端路径和其他内部路径
      if (location && (location.startsWith('/@vite/') || location.startsWith('/_nuxt/'))) {
        // 返回一个空的路由对象，避免Vue Router发出警告
        return {
          name: null,
          meta: {},
          path: location,
          hash: '',
          query: {},
          params: {},
          fullPath: location,
          matched: []
        } as any;
      }
      
      // 其他路径正常匹配
      return originalMatch(rawLocation, currentLocation, redirectedFrom);
    };
  });
});