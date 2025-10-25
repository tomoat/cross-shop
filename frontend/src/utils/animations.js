/**
 * 动画工具函数集合
 * 提供各种UI交互动画效果
 */

/**
 * 添加淡入动画类到元素
 * @param {HTMLElement} element - 目标DOM元素
 * @param {number} duration - 动画持续时间(毫秒)
 * @param {string} className - 自定义动画类名
 */
export const fadeIn = (element, duration = 300, className = 'fade-in') => {
  if (!element) return;
  
  element.style.opacity = '0';
  element.classList.add(className);
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }, 10);
};

/**
 * 添加滑入动画
 * @param {HTMLElement} element - 目标DOM元素
 * @param {string} direction - 滑入方向('top', 'bottom', 'left', 'right')
 * @param {number} duration - 动画持续时间(毫秒)
 */
export const slideIn = (element, direction = 'bottom', duration = 300) => {
  if (!element) return;
  
  const transformMap = {
    top: 'translateY(-20px)',
    bottom: 'translateY(20px)',
    left: 'translateX(-20px)',
    right: 'translateX(20px)'
  };
  
  element.style.opacity = '0';
  element.style.transform = transformMap[direction] || transformMap.bottom;
  element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translate(0)';
  }, 10);
};

/**
 * 添加缩放动画
 * @param {HTMLElement} element - 目标DOM元素
 * @param {number} scaleFrom - 起始缩放值
 * @param {number} duration - 动画持续时间(毫秒)
 */
export const scale = (element, scaleFrom = 0.9, duration = 200) => {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transform = `scale(${scaleFrom})`;
  element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  }, 10);
};

/**
 * 添加抖动动画
 * @param {HTMLElement} element - 目标DOM元素
 * @param {number} duration - 动画持续时间(毫秒)
 */
export const shake = (element, duration = 500) => {
  if (!element) return;
  
  element.classList.add('shake-animation');
  
  setTimeout(() => {
    element.classList.remove('shake-animation');
  }, duration);
};

/**
 * 滚动时的渐入动画
 * 当元素进入视口时触发渐入效果
 * @param {string} selector - CSS选择器
 * @param {number} threshold - 触发阈值(0-1)
 */
export const fadeOnScroll = (selector, threshold = 0.1) => {
  const elements = document.querySelectorAll(selector);
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fadeIn(entry.target, 600);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
  
  elements.forEach(el => observer.observe(el));
  
  return observer; // 返回observer以便在需要时可以disconnect
};

/**
 * 添加数字计数动画
 * @param {HTMLElement} element - 目标DOM元素
 * @param {number} target - 目标数字
 * @param {number} duration - 动画持续时间(毫秒)
 * @param {string} prefix - 前缀
 * @param {string} suffix - 后缀
 */
export const countUp = (element, target, duration = 2000, prefix = '', suffix = '') => {
  if (!element || isNaN(target)) return;
  
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const updateCount = () => {
    current += increment;
    
    if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
      element.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    
    element.textContent = `${prefix}${Math.floor(current)}${suffix}`;
    requestAnimationFrame(updateCount);
  };
  
  updateCount();
};

/**
 * 添加按钮点击波纹效果
 * @param {HTMLElement} button - 按钮元素
 */
export const addRippleEffect = (button) => {
  if (!button) return;
  
  button.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    button.appendChild(ripple);
  });
};

/**
 * 初始化轮播图功能
 * @param {HTMLElement} container - 轮播图容器
 * @param {Object} options - 配置选项
 */
export const initCarousel = (container, options = {}) => {
  const defaultOptions = {
    interval: 5000,
    autoplay: true,
    indicators: true,
    controls: true
  };
  
  const config = { ...defaultOptions, ...options };
  const slides = container.querySelector('.carousel-container');
  const slideItems = slides.querySelectorAll('.carousel-slide');
  const totalSlides = slideItems.length;
  let currentSlide = 0;
  let slideInterval;
  
  if (totalSlides <= 1) return;
  
  // 创建指示器
  if (config.indicators) {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
    }
    
    container.appendChild(indicatorsContainer);
  }
  
  // 创建控制按钮
  if (config.controls) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-control carousel-prev';
    prevButton.innerHTML = '&#10094;';
    prevButton.addEventListener('click', prevSlide);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-control carousel-next';
    nextButton.innerHTML = '&#10095;';
    nextButton.addEventListener('click', nextSlide);
    
    controlsContainer.appendChild(prevButton);
    controlsContainer.appendChild(nextButton);
    
    container.appendChild(controlsContainer);
  }
  
  // 切换到指定幻灯片
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    currentSlide = index;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // 更新指示器
    const indicators = container.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentSlide);
    });
  }
  
  // 上一张
  function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }
  
  // 下一张
  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }
  
  // 自动播放
  function startAutoplay() {
    if (config.autoplay) {
      slideInterval = setInterval(nextSlide, config.interval);
    }
  }
  
  // 停止自动播放
  function stopAutoplay() {
    clearInterval(slideInterval);
  }
  
  // 鼠标悬停停止自动播放
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
  
  // 启动轮播图
  startAutoplay();
  
  // 返回控制方法
  return {
    goToSlide,
    prevSlide,
    nextSlide,
    startAutoplay,
    stopAutoplay
  };
};

/**
 * 初始化所有动画效果
 * 在DOM加载完成后调用
 */
export const initAnimations = () => {
  // 为所有带fade-in-on-scroll类的元素添加滚动渐入效果
  fadeOnScroll('.fade-in-on-scroll');
  
  // 为所有按钮添加波纹效果
  document.querySelectorAll('.btn, button').forEach(button => {
    addRippleEffect(button);
  });
  
  // 初始化轮播图
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    initCarousel(carousel);
  }
};