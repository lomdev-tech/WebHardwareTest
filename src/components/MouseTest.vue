<template>
  <div class="mouse-test">
    <div class="mouse-container" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @wheel="handleWheel">
      <div class="mouse-model">
        <div class="simple-mouse">
          <svg id="mouse-svg" width="200" height="300" viewBox="0 0 200 300">
            <path class="mouse-part" d="M100,280 Q20,280 20,180 L20,100 Q20,20 100,20 Q180,20 180,100 L180,180 Q180,280 100,280 Z" />
            
            <path id="btn-left" class="mouse-part" :class="{ 'active': mouseState.leftButton }" d="M100,20 L50,20 Q20,20 20,80 L20,130 L100,130 Z" />
            
            <path id="btn-right" class="mouse-part" :class="{ 'active': mouseState.rightButton }" d="M100,20 L150,20 Q180,20 180,80 L180,130 L100,130 Z" />
            
            <rect id="wheel" class="mouse-part" :class="{ 'active': mouseState.middleButton, 'wheel-scrolling': isWheelScrolling }" x="88" y="50" width="24" height="45" rx="12" />
            
            <line x1="100" y1="130" x2="100" y2="20" stroke="#475569" stroke-width="2" />
          </svg>
        </div>
      </div>
    </div>
    <div class="mouse-status">
      <div class="status-item">
        <span class="status-label">滚轮值:</span>
        <span class="status-value">{{ wheelValue }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">左键:</span>
        <span class="status-value" :class="{ 'active': mouseState.leftButton }">{{ mouseState.leftButton ? '按下' : '释放' }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">右键:</span>
        <span class="status-value" :class="{ 'active': mouseState.rightButton }">{{ mouseState.rightButton ? '按下' : '释放' }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">中键:</span>
        <span class="status-value" :class="{ 'active': mouseState.middleButton }">{{ mouseState.middleButton ? '按下' : '释放' }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">前进键:</span>
        <span class="status-value" :class="{ 'active': mouseState.forwardButton }">{{ mouseState.forwardButton ? '按下' : '释放' }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">后退键:</span>
        <span class="status-value" :class="{ 'active': mouseState.backButton }">{{ mouseState.backButton ? '按下' : '释放' }}</span>
      </div>
    </div>
    <div class="instructions">
      <p>请在鼠标模型上点击不同的按钮</p>
      <p>滚动鼠标滚轮查看滚轮值变化</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mouseState = ref({
  leftButton: false,
  middleButton: false,
  rightButton: false,
  forwardButton: false,
  backButton: false
})

const wheelValue = ref(0)
const isWheelScrolling = ref(false)
let wheelTimer = null

// 状态映射表
const buttons = {
  0: { text: "左键点击" },
  1: { text: "中键点击" },
  2: { text: "右键点击" }
}

const handleMouseDown = (event) => {
  event.preventDefault()
  
  const btn = buttons[event.button]
  if (btn) {
    // 这里可以添加状态文本更新
  }
  
  switch (event.button) {
    case 0:
      mouseState.value.leftButton = true
      break
    case 1:
      mouseState.value.middleButton = true
      break
    case 2:
      mouseState.value.rightButton = true
      break
    case 3:
      mouseState.value.backButton = true
      break
    case 4:
      mouseState.value.forwardButton = true
      break
  }
}

const handleMouseUp = (event) => {
  event.preventDefault()
  
  const btn = buttons[event.button]
  if (btn) {
    // 这里可以添加状态文本更新
  }
  
  switch (event.button) {
    case 0:
      mouseState.value.leftButton = false
      break
    case 1:
      mouseState.value.middleButton = false
      break
    case 2:
      mouseState.value.rightButton = false
      break
    case 3:
      mouseState.value.backButton = false
      break
    case 4:
      mouseState.value.forwardButton = false
      break
  }
}

const handleWheel = (event) => {
  event.preventDefault()
  wheelValue.value += event.deltaY > 0 ? 1 : -1
  
  isWheelScrolling.value = true
  
  // 停止滚动 150ms 后自动取消高亮
  clearTimeout(wheelTimer)
  wheelTimer = setTimeout(() => {
    isWheelScrolling.value = false
  }, 150)
}

const reset = () => {
  mouseState.value = {
    leftButton: false,
    middleButton: false,
    rightButton: false,
    forwardButton: false,
    backButton: false
  }
  wheelValue.value = 0
  isWheelScrolling.value = false
  clearTimeout(wheelTimer)
}

onMounted(() => {
  // 阻止右键菜单
  window.addEventListener('contextmenu', (e) => e.preventDefault())
})

onUnmounted(() => {
  window.removeEventListener('contextmenu', (e) => e.preventDefault())
  clearTimeout(wheelTimer)
})

defineExpose({
  reset
})
</script>

<style scoped>
.mouse-test {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  min-height: calc(100vh - 100px);
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.mouse-container {
  width: 100%;
  max-width: 650px;
  height: 450px;
  @apply bg-dark-800 border border-dark-700/50 rounded-xl shadow-lg transition-all duration-300;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  cursor: crosshair;
  box-sizing: border-box;
}

.mouse-container:hover {
  @apply border-primary-500/30;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
}

.mouse-model {
  width: 100%;
  max-width: 200px;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.simple-mouse {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.simple-mouse:hover {
  transform: scale(1.05);
}

/* SVG 样式控制 */
#mouse-svg {
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

.mouse-part {
  fill: #1e293b;
  stroke: #475569;
  stroke-width: 2;
  transition: all 0.1s ease;
}

/* 默认状态下的滚轮 */
#wheel {
  fill: #334155;
}

/* 激活状态（被按下时） */
.mouse-part.active {
  fill: rgba(59, 130, 246, 0.2) !important;
  stroke: #3b82f6 !important;
  stroke-width: 3;
}

/* 滚轮滚动的特殊颜色 */
.mouse-part.wheel-scrolling {
  fill: #3b82f6 !important;
}

.mouse-status {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 650px;
  margin-bottom: 32px;
}

.status-item {
  @apply flex justify-between items-center p-4 rounded-lg border border-dark-600 bg-dark-700/50 transition-all duration-300;
}

.status-item:hover {
  @apply border-primary-500/50 bg-dark-700/80;
}

.status-label {
  font-size: 14px;
  color: #a1a1aa;
  font-weight: 500;
}

.status-value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-value.active {
  color: #4ade80;
  font-weight: 700;
  transform: scale(1.05);
}

.instructions {
  text-align: center;
  color: #a1a1aa;
  font-size: 14px;
  @apply p-5 rounded-lg border border-dark-600 bg-dark-700/50;
  max-width: 650px;
  width: 100%;
  line-height: 1.5;
}

.instructions p {
  margin: 8px 0;
}

/* 滚动条样式 */
.mouse-test::-webkit-scrollbar {
  width: 6px;
}

.mouse-test::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 3px;
}

.mouse-test::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.mouse-test::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

@media (max-width: 768px) {
  .mouse-test {
    padding: 24px;
  }
  
  .mouse-container {
    width: 100%;
    max-width: 300px;
    height: 350px;
  }
  
  .mouse-model {
    max-width: 160px;
    height: 240px;
  }
  
  .simple-mouse svg {
    width: 160px;
    height: 240px;
  }
  
  .mouse-status {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    max-width: 420px;
  }
  
  .instructions {
    max-width: 420px;
  }
}
</style>