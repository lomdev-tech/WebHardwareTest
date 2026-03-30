<template>
  <div class="screen-test">
    <div class="screen-info">
      <h3>屏幕信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">分辨率:</span>
          <span class="info-value">{{ screenWidth }} × {{ screenHeight }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">屏幕尺寸:</span>
          <span class="info-value">{{ screenSize.toFixed(1) }} 英寸</span>
        </div>
        <div class="info-item">
          <span class="info-label">颜色深度:</span>
          <span class="info-value">{{ colorDepth }} 位</span>
        </div>
        <div class="info-item">
          <span class="info-label">刷新率:</span>
          <span class="info-value">{{ refreshRate }} Hz</span>
        </div>
      </div>
    </div>

    <div class="test-sections">
      <div class="test-section">
        <h3>坏点检测</h3>
        <div class="dead-pixel-test">
          <button @click="startDeadPixelTest" class="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primary-500/30">
            开始坏点检测
          </button>
          <p class="test-description">进入全屏模式后，仔细观察屏幕上是否有异常亮点或暗点</p>
        </div>
      </div>
    </div>

    <!-- 全屏颜色测试覆盖层 -->
    <div v-if="fullScreenColor" class="full-screen-color" :style="{ backgroundColor: fullScreenColor }" @click="handleFullScreenClick" @contextmenu.prevent="exitFullScreenColor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const screenWidth = ref(window.screen.width)
const screenHeight = ref(window.screen.height)
const screenSize = ref(0)
const colorDepth = ref(window.screen.colorDepth)
const refreshRate = ref(Math.round(window.screen.refreshRate || 60))
const fullScreenColor = ref(null)
const currentColorIndex = ref(0)

// 坏点检测颜色数组
const colorList = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']

// 计算屏幕尺寸（英寸）
const calculateScreenSize = () => {
  const diagonal = Math.sqrt(Math.pow(screenWidth.value, 2) + Math.pow(screenHeight.value, 2))
  screenSize.value = diagonal / 96 // 96 DPI 是标准值
}

const exitFullScreenColor = () => {
  fullScreenColor.value = null
  // 退出全屏模式
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

const startDeadPixelTest = () => {
  currentColorIndex.value = 0
  
  // 尝试进入全屏模式
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
  
  // 显示第一个颜色
  fullScreenColor.value = colorList[currentColorIndex.value]
}

const reset = () => {
  fullScreenColor.value = null
}

// 监听键盘事件
const handleKeyDown = (event) => {
  if (!fullScreenColor.value) return
  
  if (event.key === 'Escape') {
    exitFullScreenColor()
  } else if (event.key === 'ArrowRight') {
    // 右键 - 下一个颜色
    event.preventDefault()
    currentColorIndex.value = (currentColorIndex.value + 1) % colorList.length
    if (currentColorIndex.value === 0) {
      // 完成一轮测试后退出
      exitFullScreenColor()
    } else {
      fullScreenColor.value = colorList[currentColorIndex.value]
    }
  } else if (event.key === 'ArrowLeft') {
    // 左键 - 上一个颜色
    event.preventDefault()
    currentColorIndex.value = (currentColorIndex.value - 1 + colorList.length) % colorList.length
    fullScreenColor.value = colorList[currentColorIndex.value]
  }
}

// 监听鼠标滚轮切换颜色
const handleWheel = (event) => {
  if (!fullScreenColor.value) return
  
  event.preventDefault()
  
  if (event.deltaY > 0) {
    // 向下滚动 - 下一个颜色
    currentColorIndex.value = (currentColorIndex.value + 1) % colorList.length
    if (currentColorIndex.value === 0) {
      // 完成一轮测试后退出
      exitFullScreenColor()
    } else {
      fullScreenColor.value = colorList[currentColorIndex.value]
    }
  } else {
    // 向上滚动 - 上一个颜色
    currentColorIndex.value = (currentColorIndex.value - 1 + colorList.length) % colorList.length
    fullScreenColor.value = colorList[currentColorIndex.value]
  }
}

// 处理全屏点击事件 - 鼠标左键单击切换颜色
const handleFullScreenClick = (event) => {
  if (!fullScreenColor.value) return
  
  // 左键单击切换到下一个颜色
  currentColorIndex.value = (currentColorIndex.value + 1) % colorList.length
  if (currentColorIndex.value === 0) {
    // 完成一轮测试后退出
    exitFullScreenColor()
  } else {
    fullScreenColor.value = colorList[currentColorIndex.value]
  }
}

onMounted(() => {
  calculateScreenSize()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('wheel', handleWheel)
})

defineExpose({
  reset
})
</script>

<style scoped>
.screen-test {
  padding: 32px;
  min-height: calc(100vh - 100px);
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.screen-info {
  @apply glass-card p-6 mb-8 hw-accel;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.screen-info h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  @apply flex justify-between items-center p-4 rounded-lg border border-dark-600 bg-dark-700/50 transition-all duration-300 hw-accel;
}

.info-item:hover {
  @apply border-primary-500/50 bg-dark-700/80;
}

.info-label {
  color: #a1a1aa;
  font-weight: 500;
  font-size: 14px;
}

.info-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.test-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.test-section {
  @apply glass-card p-6 border border-dark-700/50 transition-all duration-300 hw-accel;
}

.test-section:hover {
  @apply border-primary-500/30;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
}

.test-section h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
}

.dead-pixel-test {
  text-align: center;
}

.dead-pixel-test button {
  margin-bottom: 16px;
}

.test-description {
  color: #a1a1aa;
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.5;
  @apply p-4 rounded-lg border border-dark-600 bg-dark-700/50;
}

.full-screen-color {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  cursor: pointer;
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-screen-color::after {
  content: '点击切换颜色 | 测试完成后自动退出 | ESC 退出';
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.full-screen-color:hover::after {
  opacity: 1;
}

/* 滚动条样式 */
.screen-test::-webkit-scrollbar {
  width: 6px;
}

.screen-test::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 3px;
}

.screen-test::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.screen-test::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

@media (max-width: 768px) {
  .screen-test {
    padding: 24px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .test-sections {
    grid-template-columns: 1fr;
  }
}
</style>