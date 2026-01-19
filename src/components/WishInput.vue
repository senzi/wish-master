<script setup>
import { ref, computed } from 'vue';
import { useWishEnergy } from '../composables/useWishEnergy';

// 定义组件事件
const emit = defineEmits(['submit']);

const { count, stability, countdownStr, consumeEnergy, MAX_ENERGY, MAX_STABILITY } = useWishEnergy();

// 愿望输入
const wishInput = ref('');
const isSubmitting = ref(false);
// 呜呜，把字数限制提升到80啦
const maxLength = 80;

// 更改为更有“欲望感”的示例
const exampleWishes = [
  '想要永远不用工作',
  '希望变身亿万富翁',
  '想让大家都听我的'
];

// 处理提交
function handleSubmit() {
  if (!wishInput.value.trim() || isSubmitting.value || count.value <= 0) return;
  if (wishInput.value.length > maxLength) return;
  
  if (consumeEnergy()) {
    isSubmitting.value = true;
    emit('submit', wishInput.value);
    
    // 重置状态
    setTimeout(() => {
      isSubmitting.value = false;
    }, 500);
  }
}

// 填充示例愿望
function fillExampleWish(wish) {
  wishInput.value = wish;
}

// 计算剩余字数
const remainingChars = computed(() => {
  return maxLength - wishInput.value.length;
});
</script>

<template>
  <div class="wish-input-container">
    <h2 class="input-title">契约内容</h2>
    
    <div class="input-wrapper">
      <input
        v-model="wishInput"
        type="text"
        class="wish-input"
        placeholder="在此写下你渴望之物..."
        :maxlength="maxLength"
        @keyup.enter="handleSubmit"
      />
      <span class="char-counter" :class="{ 'warning': remainingChars < 10 }">
        {{ remainingChars }}
      </span>
    </div>

    <div class="energy-status-row">
      <!-- CD 时间 -->
      <div v-if="count < MAX_ENERGY" class="cd-text">
        ({{ countdownStr }})
      </div>

      <!-- 紫色能量点 -->
      <div class="slots">
        <div 
          v-for="i in MAX_ENERGY" 
          :key="'e'+i" 
          class="dot purple" 
          :class="{ active: i <= count }"
        ></div>
      </div>

      <!-- 分隔符 -->
      <div class="separator">|</div>

      <!-- 红色能量点 -->
      <div class="slots">
        <div 
          v-for="i in MAX_STABILITY" 
          :key="'s'+i" 
          class="dot red" 
          :class="{ active: i <= stability }"
        ></div>
      </div>
    </div>

    <!-- 灵魂耗尽提示 -->
    <transition name="fade">
      <div v-if="stability <= 0" class="stability-alert">
        <p>「灵魂已支离破碎...」</p>
        <small>因果律已拒绝你的连接。唯有完成一次纯粹的愿望，方可重塑灵魂。</small>
      </div>
    </transition>
    
    <button 
      @click="handleSubmit" 
      class="submit-button"
      :disabled="!wishInput.trim() || wishInput.length > maxLength || isSubmitting || count <= 0"
    >
      <template v-if="!isSubmitting">
        <span v-if="count > 0">签订契约</span>
        <span v-else>能量不足</span>
      </template>
      <span v-else class="loading-dots">因果计算中<span>.</span><span>.</span><span>.</span></span>
    </button>
    
    <div class="examples-container">
      <p class="examples-title">常见欲望：</p>
      <div class="examples-list">
        <button 
          v-for="(wish, index) in exampleWishes" 
          :key="index"
          @click="fillExampleWish(wish)"
          class="example-item"
        >
          {{ wish }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wish-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.input-title {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
  letter-spacing: 2px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.wish-input {
  width: 100%;
  padding: 14px 45px 14px 18px;
  font-size: 1.1rem;
  /* 黑色边框增加契约严肃感 */
  border: 2px solid #2c3e50;
  border-radius: 4px; 
  background-color: transparent;
  transition: all 0.3s;
}

.wish-input:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(44, 62, 80, 0.2);
  border-color: #8e44ad; /* 聚焦时带点紫色 */
}

.char-counter {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #999;
}

.char-counter.warning {
  color: #e74c3c;
}

.energy-status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  font-family: monospace;
}

.cd-text {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.slots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid #2c3e50;
  background-color: transparent;
  transition: all 0.3s ease;
}

.dot.purple.active {
  background-color: #8e44ad;
  border-color: #8e44ad;
  box-shadow: 0 0 4px rgba(142, 68, 173, 0.5);
}

.dot.red.active {
  background-color: #e74c3c;
  border-color: #e74c3c;
  box-shadow: 0 0 4px rgba(231, 76, 60, 0.5);
}

.separator {
  color: #bdc3c7;
  font-weight: bold;
  margin: 0 4px;
}

.stability-alert {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  color: #c0392b;
}

.stability-alert p {
  margin: 0 0 5px 0;
  font-weight: bold;
  font-size: 0.9rem;
}

.stability-alert small {
  font-size: 0.75rem;
  display: block;
}

.submit-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 160px;
  letter-spacing: 2px;
  font-weight: bold;
}

.submit-button:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.submit-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.examples-container {
  margin-top: 30px;
  width: 100%;
}

.examples-title {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 10px;
  text-align: center;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.example-item {
  background-color: transparent;
  border: 1px dashed #bdc3c7;
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 0.85rem;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.2s;
}

.example-item:hover {
  border-style: solid;
  border-color: #8e44ad;
  color: #8e44ad;
  background-color: rgba(142, 68, 173, 0.05);
}

/* 加载动画 */
.loading-dots span {
  animation: loadingDots 1.4s infinite;
  animation-fill-mode: both;
}

@keyframes loadingDots {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}

/* 简单的淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

