<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { animate } from 'animejs';
import { snapdom } from '@zumer/snapdom'; // 确保你安装了 npm install @zumer/snapdom

// 动态添加 DaisyUI CSS (保持你的原始逻辑)
onMounted(() => {
  if (!document.querySelector('link[href*="daisyui"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.bootcdn.net/ajax/libs/daisyui/4.12.23/full.min.css';
    document.head.appendChild(link);
  }
});

const props = defineProps({
  signData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['restart']);
const cardRef = ref(null);
const isDownloading = ref(false); // 下载状态，防止重复点击

// 重新开始
function handleRestart() {
  emit('restart');
}

// 下载图片逻辑
async function handleDownload() {
  if (!cardRef.value || isDownloading.value) return;

  isDownloading.value = true;

  try {
    // 1. 临时强制设置宽度，为了让移动端截图也能像桌面端一样宽
    // 保存原始样式以便恢复
    const originalWidth = cardRef.value.style.width;
    const originalMaxWidth = cardRef.value.style.maxWidth;

    // 强制设定为桌面端的典型宽度 (例如 600px)，防止手机上截成细长条
    // 注意：用户可能会瞬间看到闪烁，但这是为了截图正确
    cardRef.value.style.width = '600px';
    cardRef.value.style.maxWidth = 'none';

    // 2. 使用 snapdom 截图
    // 这里的 scale: 2 是为了高清屏（Retina）效果，保证文字清晰
    const result = await snapdom(cardRef.value, {
      scale: 2,
      style: {
        // 确保截图背景是干净的，防止透明
        backgroundColor: '#fff9f0',
      }
    });

    // 3. 触发下载
    // 文件名带上时间戳，增加仪式感
    const filename = `PerfectWish_Contract_${Date.now()}`;
    await result.download({ format: 'png', filename: filename });

    // 4. 恢复样式
    cardRef.value.style.width = originalWidth;
    cardRef.value.style.maxWidth = originalMaxWidth;

  } catch (error) {
    console.error('保存契约失败:', error);
    alert('保存失败，请截图保存 w');
  } finally {
    isDownloading.value = false;
  }
}

// 入场动画
onMounted(async () => {
  await nextTick();
  if (cardRef.value) {
    animate(cardRef.value, {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      easing: 'easeOutElastic(1, .8)'
    });
  }
});
</script>

<template>
  <div class="result-card-container">
    <div ref="cardRef" class="card bg-base-100 shadow-xl result-card">
      <div class="contract-header"></div>

      <div class="card-body">
        <div class="wish-section">
          <div class="label-tag">原定愿望</div>
          <h2 class="wish-title">「 {{ props.signData.confirmed_wish }} 」</h2>
        </div>

        <div class="divider">契约达成情况</div>

        <div class="realization-section">
          <div class="label-tag danger">实现场景 (逻辑检查通过)</div>
          <p class="scenario-text">
            {{ props.signData.realization_scenario }}
          </p>

          <div class="contract-seal">已达成</div>
        </div>

        <div class="disclaimer">
          警告：本系统遵循严格的逻辑演绎，任何利益受损均由许愿者逻辑不严密引起。<br>
          Powered by DeepSeek & 完美许愿器 v2.0
        </div>

        <div class="promo-link">
          完美许愿器 · wish.closeai.moe
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="handleDownload" class="btn btn-outline btn-secondary shadow-md" :disabled="isDownloading">
        <span v-if="!isDownloading">保存契约图片</span>
        <span v-else class="loading loading-spinner loading-sm"></span>
      </button>

      <button @click="handleRestart" class="btn btn-primary shadow-lg">
        重新修正愿望 w
      </button>
    </div>

    <div class="stats-hint">
      <p>
        完美许愿器已经处理超过 <span class="num">100万</span> 个愿望。
      </p>
      <p>
        如果你因此感到“快乐”，可以点击页面最下方的按钮支持。
      </p>
    </div>

  </div>
</template>

<style scoped>
.result-card-container {
  max-width: 600px;
  /* 这里的限制只影响网页显示 */
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  /* 防止截图时强制撑大导致页面横向滚动条出现 */
  overflow-x: visible;
}

.card {
  background: #fff9f0 !important;
  /* 像旧纸张一样的颜色 */
  border: 2px solid #2c3e50;
  color: #2c3e50 !important;
  opacity: 0;
  position: relative;
  /* overflow: hidden; 去掉这个，防止印章被切掉 */
  border-radius: 4px;
  /* 稍微方正一点 */
}

/* 契约顶部的条纹 */
.contract-header {
  height: 12px;
  background: repeating-linear-gradient(45deg,
      #2c3e50,
      #2c3e50 10px,
      #e74c3c 10px,
      #e74c3c 20px);
  border-bottom: 2px solid #2c3e50;
}

.label-tag {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.label-tag.danger {
  color: #e74c3c;
}

.wish-title {
  font-size: 1.4rem;
  font-weight: 800;
  text-align: center;
  padding: 1rem 0;
  font-style: italic;
  font-family: "Songti SC", "SimSun", serif;
  /* 增加一点衬线体感觉 */
}

.divider {
  font-size: 0.8rem;
  color: #bdc3c7;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #bdc3c7;
  margin: 0 10px;
}

.realization-section {
  position: relative;
  background: rgba(44, 62, 80, 0.03);
  padding: 1.5rem;
  border-radius: 2px;
  border: 1px dashed #bdc3c7;
  min-height: 150px;
}

.scenario-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  z-index: 1;
  position: relative;
  white-space: pre-wrap;
  text-align: justify;
}

/* 装饰性印章样式 */
.contract-seal {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 90px;
  height: 90px;
  border: 4px double rgba(231, 76, 60, 0.5);
  border-radius: 50%;
  color: rgba(231, 76, 60, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  transform: rotate(-20deg);
  font-size: 1.2rem;
  pointer-events: none;
  user-select: none;
  /* 加上印章的质感 */
  mask-image: radial-gradient(circle, black 50%, transparent 100%);
}

.disclaimer {
  font-size: 0.7rem;
  color: #95a5a6;
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 推广链接样式 */
.promo-link {
  text-align: center;
  font-size: 0.75rem;
  color: #bdc3c7;
  margin-top: 8px;
  font-family: monospace;
  letter-spacing: 1px;
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  /* 按钮之间分开一点 */
  flex-wrap: wrap;
}

/* 按钮样式微调 */
.btn {
  min-width: 140px;
}

.btn-primary {
  background-color: #2c3e50 !important;
  border-color: #2c3e50 !important;
  color: white !important;
}

.btn-secondary {
  border-color: #2c3e50 !important;
  color: #2c3e50 !important;
}

.btn-secondary:hover {
  background-color: #2c3e50 !important;
  color: white !important;
}

@media (max-width: 640px) {
  .wish-title {
    font-size: 1.2rem;
  }

  .scenario-text {
    font-size: 1rem;
  }

  /* 移动端按钮竖排 */
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}

/* 新增样式：底部统计提示 */
.stats-hint {
  text-align: center;
  margin-top: 1rem;       /* 与按钮拉开一点距离 */
  margin-bottom: 1rem;    /* 底部留白 */
  font-size: 0.8rem;      /* 字号偏小，显得精致 */
  color: #7f8c8d;         /* 使用低调的灰色，不刺眼 */
  line-height: 1.6;       /* 行高拉开，防止两行挤在一起 */
}

/* 数字强调 */
.stats-hint .num {
  color: #2c3e50;         /* 深色突出数字 */
  font-weight: bold;
  font-family: 'Courier New', monospace; /* 等宽字体增加一点“系统数据”的感觉 */
  margin: 0 2px;
}

/* 移动端适配微调 */
@media (max-width: 640px) {
  /* ...原有移动端样式... */
  
  .stats-hint {
    font-size: 0.75rem;   /* 手机上字体再稍微小一点点 */
    padding: 0 10px;      /* 防止文字贴边 */
  }
}

</style>