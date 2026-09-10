# 完美许愿器 (Wish Master)

**“So tell me, what is it you truly desire?”**

完美许愿器是一个基于 Vue 3 + Vite 构建的因果律模拟应用。它不再是传统的抽签程序，而是一个深谙逻辑漏洞的“邪恶灯神”。它利用 DeepSeek API 的强大推理能力，在满足用户愿望的同时，精准指出其中的逻辑漏洞并反馈一个毫无收益的反转现实。

## 🌟 项目亮点

* **逻辑反转**：不同于常规的祝福，系统会以幽默且腹黑的视角钻愿望的漏洞。
* **双重 LLM 校验**：集成内容审核与场景生成，确保合规的同时保证文案质量。
* **契约感视觉**：全新的暗黑系/契约感 UI 设计，沉浸式许愿体验。
* **Serverless 架构**：完全部署于 Cloudflare Pages Functions，零成本维护后端逻辑。
* **因果律屏障**：严格的输入限制，模拟“契约纸张有限”的荒诞感。

## 🛠️ 核心架构

### 前端组件

* **HomeView.vue**：契约主控室，管理从输入到生成的单向因果流。
* **WishInput.vue**：欲望输入端口，支持快捷选择“常见欲望”。
* **StepFlow.vue**：展示审查、寻漏、构建现实的仪式感进度。
* **SignCard.vue**：展示最终达成的“崩坏契约”结果。

### 后端逻辑 (Functions)

* **validateWish.js**：核心网关。
    1.  拦截敏感内容（暴力、色情等）。
    2.  格式化愿望文本。
    3.  调用 LLM 进行逻辑漏洞演绎。

## 📡 API 接口说明

### 核心接口：`/api/validateWish`

**Method**: `POST`

**Description**: 一站式处理愿望审核与结果生成。

**请求体**:

```json
{
  "wish": "我想要点石成金的能力"
}

```

**响应体 (Success)**:

```json
{
  "status": "success",
  "result": {
    "category": "allow",
    "confirmed_wish": "我想要点石成金的能力",
    "scenario": "你的愿望实现了，但由于金价暴跌且你触碰的日常用品都变成了无用的重金属，你最终一贫如洗..."
  },
  "debug_audit": { "..." } // 仅供调试参考
}

```

## 🚀 快速开始

### 1. 克隆与安装

```bash
git clone https://github.com/senzi/wish-master.git
cd wish-master
npm install

```

### 2. 环境配置

在根目录创建 `.dev.vars` 文件：

```env
DEEPSEEK_API_KEY=你的API密钥
DEEPSEEK_API_BASE_URL=https://api.deepseek.com

```

### 3. 本地调试

```bash
# 启动前端开发环境
npm run dev

# 或使用 Wrangler 模拟 Cloudflare 全栈环境
npm run build && npx wrangler pages dev dist --compatibility-date=2024-01-01

```

## ⚠️ 规则声明 (Caveat Emptor)

1. **长度限制**：愿望不得超过 80 字符，否则因果律将崩溃。
2. **违规拦截**：涉及暴力、色情或特定敏感词的愿望将被神隐。
3. **能量限制**：
    * **许愿能量 (紫色)**：上限 3 点，每 10 分钟恢复 1 点。每次许愿消耗 1 点。
    * **灵魂稳定性 (红色)**：上限 6 点，**不会自动恢复**。愿望被拦截（Block）时扣除 1 点，成功完成一次许愿后立即回满。
    * **回滚机制**：若愿望被拦截或系统出错，将返还消耗的紫色能量。
4. **额度不足**：若系统 API 额度耗尽（402 错误），将展示“因果律超载”卡片，用户可复制引导指令至其他 AI 助手（如 DeepSeek, Kimi 等）继续完成许愿。
5. **后果自负**：本系统生成的场景纯属逻辑推演，若现实中发生类似反转，概不负责 w。


## ⚡ 链接与供能 (Connect & Power)

维护现实扭曲场的运作需要消耗大量的算力与咖啡因。如果你觉得这个观测点有趣，可以通过以下方式建立神经连接：

* **🌀 [潜入内部圈子](https://vipclub.weibo.com/vmember/gfopend?F=profile&vuid=7402396589)**
    * 加入微博专属社群，与更多有趣的灵魂闲聊，或许能发现系统的后门 w (ACCESS: YEARLY PASS)
* **👁️ [成为观测者](https://weibo.com/u/7402396589)**
    * 关注本身就是一种量子纠缠。你的注视能让这个不稳定的系统更加“存在”。(STATUS: FOLLOW @阿尼亚是安妮亞)
* **☕ 投喂单次补给**
    * 为 LLM 服务提供一点算力，或者请开发者喝杯冰美式。

    <br>
    <div align="center">
        <img src="public/sponsor.png" width="220" alt="WeChat Pay / Alipay" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <br>
        <sub>Scan to recharge the Reality Distortion Field</sub>
        <br>
        <sub>(微信 / WeChat Pay)</sub>
    </div>

---

© 2026 完美许愿器 | 智慧来源：DeepSeek
