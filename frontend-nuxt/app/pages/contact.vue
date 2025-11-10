<template>
  <div class="contact-page">
    <!-- 页面标题 -->
    <div class="hero bg-blue-50 py-16 mb-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">联系我们</h1>
        <p class="mt-4 text-xl text-gray-600">我们期待听到您的声音</p>
      </div>
    </div>

    <!-- 联系表单和地图 -->
    <section class="container mx-auto px-4 mb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- 联系表单 -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">发送消息</h2>
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- 姓名 -->
            <div>
              <label for="name" class="block text-gray-700 font-medium mb-2">姓名</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                placeholder="请输入您的姓名" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <!-- 邮箱 -->
            <div>
              <label for="email" class="block text-gray-700 font-medium mb-2">邮箱</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                placeholder="请输入您的邮箱" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <!-- 主题 -->
            <div>
              <label for="subject" class="block text-gray-700 font-medium mb-2">主题</label>
              <select 
                id="subject" 
                v-model="formData.subject" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">请选择联系主题</option>
                <option value="product">产品咨询</option>
                <option value="order">订单问题</option>
                <option value="return">退换货</option>
                <option value="suggestion">建议反馈</option>
                <option value="cooperation">合作洽谈</option>
                <option value="other">其他问题</option>
              </select>
            </div>

            <!-- 消息 -->
            <div>
              <label for="message" class="block text-gray-700 font-medium mb-2">消息内容</label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                rows="6" 
                placeholder="请输入您的消息内容" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              ></textarea>
            </div>

            <!-- 验证码 -->
            <div>
              <label for="captcha" class="block text-gray-700 font-medium mb-2">验证码</label>
              <div class="flex space-x-4">
                <input 
                  type="text" 
                  id="captcha" 
                  v-model="formData.captcha" 
                  placeholder="请输入验证码" 
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div class="w-32 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors" @click="refreshCaptcha">
                  {{ captchaText }}
                </div>
              </div>
            </div>

            <!-- 提交按钮 -->
            <button 
              type="submit" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              :disabled="submitting"
            >
              <span v-if="!submitting">发送消息</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                发送中...
              </span>
            </button>
          </form>
        </div>

        <!-- 联系信息 -->
        <div>
          <!-- 联系卡片 -->
          <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">联系方式</h2>
            <ul class="space-y-6">
              <!-- 地址 -->
              <li class="flex items-start">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800">公司地址</h3>
                  <p class="text-gray-600">上海市浦东新区张江高科技园区博云路2号</p>
                </div>
              </li>

              <!-- 电话 -->
              <li class="flex items-start">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800">联系电话</h3>
                  <p class="text-gray-600">400-888-8888</p>
                  <p class="text-gray-500 text-sm">周一至周日 9:00 - 18:00</p>
                </div>
              </li>

              <!-- 邮箱 -->
              <li class="flex items-start">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800">电子邮箱</h3>
                  <p class="text-gray-600">contact@cross-shop.com</p>
                  <p class="text-gray-500 text-sm">我们通常在24小时内回复</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- 地图占位符 -->
          <div class="bg-gray-100 rounded-xl overflow-hidden h-[300px]">
            <img src="https://picsum.photos/id/1031/800/600" alt="公司位置地图" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-12 text-center">常见问题</h2>
        <div class="max-w-3xl mx-auto">
          <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
            <div 
              class="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all" 
              :class="{ 'border-l-4 border-blue-500': expandedFaq === index }"
              @click="toggleFaq(index)"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800">{{ faq.question }}</h3>
                <svg class="w-6 h-6 text-gray-500 transition-transform" :class="{ 'rotate-180': expandedFaq === index }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div v-if="expandedFaq === index" class="mt-4 text-gray-600">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 表单数据
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  captcha: ''
});

// 提交状态
const submitting = ref(false);

// 验证码
const captchaText = ref('');

// FAQ状态
const expandedFaq = ref(null);
const faqs = ref([
  {
    question: '如何查询订单状态？',
    answer: '您可以登录账户后，在"我的订单"页面查看所有订单的状态。也可以通过我们的客服热线400-888-8888提供订单号进行查询。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持支付宝、微信支付、银联支付、信用卡等多种支付方式，您可以在结算页面选择您偏好的支付方式。'
  },
  {
    question: '如何申请退换货？',
    answer: '您可以在收到商品后7天内，在"我的订单"页面申请退换货。我们的客服会在1-2个工作日内与您联系处理。请注意，商品需保持完好，不影响二次销售。'
  },
  {
    question: '配送范围和时效如何？',
    answer: '我们支持全国大部分地区的配送服务。一线城市通常1-2天送达，其他地区3-5天送达。特殊地区或特殊商品可能需要更长时间。'
  },
  {
    question: '如何注册会员？',
    answer: '您可以点击网站右上角的"注册"按钮，按照提示填写相关信息完成注册。注册后，您可以享受会员专属优惠和积分服务。'
  }
]);

// 生命周期钩子
onMounted(() => {
  refreshCaptcha();
});

// 刷新验证码
function refreshCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = result;
  formData.value.captcha = '';
}

// 切换FAQ展开状态
function toggleFaq(index) {
  expandedFaq.value = expandedFaq.value === index ? null : index;
}

// 提交表单
function submitForm() {
  // 验证表单
  if (!formData.value.name || !formData.value.email || !formData.value.subject || !formData.value.message || !formData.value.captcha) {
    alert('请填写所有必填字段');
    return;
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    alert('请输入有效的邮箱地址');
    return;
  }

  // 验证验证码
  if (formData.value.captcha.toLowerCase() !== captchaText.value.toLowerCase()) {
    alert('验证码错误');
    refreshCaptcha();
    return;
  }

  // 模拟提交
  submitting.value = true;
  
  setTimeout(() => {
    console.log('表单提交数据:', formData.value);
    alert('消息发送成功！我们会尽快与您联系。');
    
    // 重置表单
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
      captcha: ''
    };
    
    refreshCaptcha();
    submitting.value = false;
  }, 1500);
}
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 160px); /* 减去导航栏和页脚的高度 */
}

.hero {
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05));
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>