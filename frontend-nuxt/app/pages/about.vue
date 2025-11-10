<template>
  <div class="about-page">
    <!-- 页面标题 -->
    <div class="hero bg-gray-100 py-16 mb-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">关于我们</h1>
        <p class="mt-4 text-xl text-gray-600">致力于为您提供优质的产品和服务</p>
      </div>
    </div>

    <!-- 公司简介 -->
    <section class="container mx-auto px-4 mb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="about-image">
          <div class="bg-white rounded-xl shadow-lg p-4">
            <img src="https://picsum.photos/id/28/800/600" alt="公司办公环境" class="w-full h-auto rounded-lg" />
          </div>
        </div>
        <div class="about-content">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">公司简介</h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Cross-Shop成立于2020年，是一家专注于提供高品质产品和卓越客户体验的电子商务平台。我们的使命是通过创新的技术和优质的服务，连接全球优质商品和消费者。
          </p>
          <p class="text-gray-700 mb-4 leading-relaxed">
            从创立之初，我们就坚持以客户为中心的经营理念，不断优化我们的产品线和购物体验。我们的团队由行业专家组成，拥有丰富的电子商务运营经验，致力于为您提供最好的购物体验。
          </p>
          <p class="text-gray-700 leading-relaxed">
            在Cross-Shop，我们相信优质的产品和服务应该人人可得。我们与全球数百家优质供应商建立了长期合作关系，确保为您提供最具性价比的产品选择。
          </p>
        </div>
      </div>
    </section>

    <!-- 我们的优势 -->
    <section class="bg-gray-50 py-16 mb-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-12 text-center">我们的优势</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- 优势1 -->
          <div class="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">优质产品</h3>
            <p class="text-gray-600">我们严格筛选每一款产品，确保其质量和性能达到最高标准。</p>
          </div>

          <!-- 优势2 -->
          <div class="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">价格实惠</h3>
            <p class="text-gray-600">通过直接与供应商合作，我们能够提供最具竞争力的价格。</p>
          </div>

          <!-- 优势3 -->
          <div class="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">快速配送</h3>
            <p class="text-gray-600">我们与多家物流合作伙伴合作，确保您的订单能够快速安全地送达。</p>
          </div>

          <!-- 优势4 -->
          <div class="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-2">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">贴心服务</h3>
            <p class="text-gray-600">我们的客服团队7x24小时为您提供专业的购物咨询和售后服务。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队介绍 -->
    <section class="container mx-auto px-4 mb-16">
      <h2 class="text-3xl font-bold text-gray-800 mb-12 text-center">我们的团队</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- 团队成员1 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="aspect-square overflow-hidden">
            <img src="https://picsum.photos/id/64/400/400" alt="团队成员" class="w-full h-full object-cover transition-transform hover:scale-105" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800">李明</h3>
            <p class="text-blue-600 mb-2">创始人 & CEO</p>
            <p class="text-gray-600">拥有10年电子商务行业经验，带领团队不断创新发展。</p>
          </div>
        </div>

        <!-- 团队成员2 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="aspect-square overflow-hidden">
            <img src="https://picsum.photos/id/65/400/400" alt="团队成员" class="w-full h-full object-cover transition-transform hover:scale-105" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800">张华</h3>
            <p class="text-blue-600 mb-2">产品总监</p>
            <p class="text-gray-600">专注于产品设计和用户体验，打造卓越的购物平台。</p>
          </div>
        </div>

        <!-- 团队成员3 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="aspect-square overflow-hidden">
            <img src="https://picsum.photos/id/66/400/400" alt="团队成员" class="w-full h-full object-cover transition-transform hover:scale-105" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800">王芳</h3>
            <p class="text-blue-600 mb-2">市场总监</p>
            <p class="text-gray-600">负责品牌建设和市场营销策略，提升品牌影响力。</p>
          </div>
        </div>

        <!-- 团队成员4 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="aspect-square overflow-hidden">
            <img src="https://picsum.photos/id/67/400/400" alt="团队成员" class="w-full h-full object-cover transition-transform hover:scale-105" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800">赵强</h3>
            <p class="text-blue-600 mb-2">技术总监</p>
            <p class="text-gray-600">领导技术团队开发创新解决方案，确保平台稳定运行。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="bg-gray-800 text-white py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">联系我们</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 联系信息 -->
          <div class="contact-info">
            <h3 class="text-xl font-bold mb-4">联系方式</h3>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-6 h-6 mr-3 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>上海市浦东新区张江高科技园区博云路2号</span>
              </li>
              <li class="flex items-center">
                <svg class="w-6 h-6 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>contact@cross-shop.com</span>
              </li>
              <li class="flex items-center">
                <svg class="w-6 h-6 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>400-888-8888</span>
              </li>
            </ul>
          </div>

          <!-- 营业时间 -->
          <div class="business-hours">
            <h3 class="text-xl font-bold mb-4">营业时间</h3>
            <ul class="space-y-2">
              <li class="flex justify-between">
                <span>周一至周五</span>
                <span>9:00 - 18:00</span>
              </li>
              <li class="flex justify-between">
                <span>周六至周日</span>
                <span>10:00 - 16:00</span>
              </li>
              <li class="flex justify-between">
                <span>法定节假日</span>
                <span>10:00 - 14:00</span>
              </li>
            </ul>
          </div>

          <!-- 关注我们 -->
          <div class="follow-us">
            <h3 class="text-xl font-bold mb-4">关注我们</h3>
            <div class="flex space-x-4">
              <a href="#" class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" class="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
              <a href="#" class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" class="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
            <p class="mt-4 text-gray-300">扫描二维码关注公众号</p>
            <div class="mt-2 bg-white p-2 inline-block rounded">
              <img src="https://picsum.photos/id/30/120/120" alt="公众号二维码" class="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 关于页面的脚本部分
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 160px); /* 减去导航栏和页脚的高度 */
}

.hero {
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
}

.about-image img {
  transition: transform 0.3s ease;
}

.about-image:hover img {
  transform: scale(1.02);
}
</style>