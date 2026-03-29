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
        <h3>颜色测试</h3>
        <div class="color-test">
          <div class="color-squares">
            <div class="color-square" style="background-color: #ff0000;" @click="setFullScreenColor('#ff0000')"></div>
            <div class="color-square" style="background-color: #00ff00;" @click="setFullScreenColor('#00ff00')"></div>
            <div class="color-square" style="background-color: #0000ff;" @click="setFullScreenColor('#0000ff')"></div>
            <div class="color-square" style="background-color: #ffff00;" @click="setFullScreenColor('#ffff00')"></div>
            <div class="color-square" style="background-color: #ff00ff;" @click="setFullScreenColor('#ff00ff')"></div>
            <div class="color-square" style="background-color: #00ffff;" @click="setFullScreenColor('#00ffff')"></div>
            <div class="color-square" style="background-color: #000000;" @click="setFullScreenColor('#000000')"></div>
            <div class="color-square" style="background-color: #ffffff;" @click="setFullScreenColor('#ffffff')"></div>
          </div>
          <p class="test-description">点击颜色方块进入全屏测试模式，按 ESC 或右键退出，滚轮/左右键/左键单击切换颜色</p>
        </div>
      </div>

      <div class="test-section">
        <h3>坏点检测</h3>
        <div class="dead-pixel-test">
          <el-button type="primary" @click="startDeadPixelTest">开始坏点检测</el-button>
          <p class="test-description">进入全屏模式后，仔细观察屏幕上是否有异常亮点或暗点</p>
        </div>
      </div>

      <div class="test-section">
        <h3>响应测试</h3>
        <div class="response-test">
          <div class="response-box" @click="recordClickTime">
            <span v-if="!clickTime">点击此处</span>
            <span v-else>响应时间: {{ clickTime }}ms</span>
          </div>
          <p class="test-description">测试屏幕响应速度</p>
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
const clickTime = ref(null)
const clickStartTime = ref(0)

// 颜色测试数组
const colorList = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff']
const currentColorIndex = ref(0)

// 计算屏幕尺寸（英寸）
const calculateScreenSize = () => {
  const diagonal = Math.sqrt(Math.pow(screenWidth.value, 2) + Math.pow(screenHeight.value, 2))
  screenSize.value = diagonal / 96 // 96 DPI 是标准值
}

const setFullScreenColor = (color) => {
  fullScreenColor.value = color
  currentColorIndex.value = colorList.indexOf(color)
  // 尝试进入全屏模式
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
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
  // 循环显示不同颜色
  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']
  let index = 0
  
  fullScreenColor.value = colors[index]
  
  // 尝试进入全屏模式
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
  
  // 每3秒切换一次颜色
  const interval = setInterval(() => {
    index = (index + 1) % colors.length
    fullScreenColor.value = colors[index]
  }, 3000)
  
  // 点击退出
  setTimeout(() => {
    clearInterval(interval)
  }, 15000) // 15秒后自动停止
}

const recordClickTime = () => {
  if (!clickStartTime.value) {
    clickStartTime.value = Date.now()
    clickTime.value = null
  } else {
    clickTime.value = Date.now() - clickStartTime.value
    clickStartTime.value = 0
  }
}

const reset = () => {
  fullScreenColor.value = null
  clickTime.value = null
  clickStartTime.value = 0
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
    fullScreenColor.value = colorList[currentColorIndex.value]
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
  } else {
    // 向上滚动 - 上一个颜色
    currentColorIndex.value = (currentColorIndex.value - 1 + colorList.length) % colorList.length
  }
  
  fullScreenColor.value = colorList[currentColorIndex.value]
}

// 处理全屏点击事件 - 鼠标左键单击切换颜色
const handleFullScreenClick = (event) => {
  if (!fullScreenColor.value) return
  
  // 左键单击切换到下一个颜色
  currentColorIndex.value = (currentColorIndex.value + 1) % colorList.length
  fullScreenColor.value = colorList[currentColorIndex.value]
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
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.screen-info:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.screen-info h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.info-item:hover {
  background-color: #ecf5ff;
  border-color: #d9ecff;
}

.info-label {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-weight: 600;
  font-size: 14px;
}

.test-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.test-section {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.test-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.test-section h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 16px;
}

.color-test {
  text-align: center;
}

.color-squares {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.color-square {
  width: 100%;
  height: 85px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e4e7ed;
  position: relative;
  overflow: hidden;
}

.color-square:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.color-square::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%);
  transition: all 0.3s ease;
}

.dead-pixel-test {
  text-align: center;
}

.dead-pixel-test .el-button {
  margin-bottom: 16px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
}

.response-test {
  text-align: center;
}

.response-box {
  width: 220px;
  height: 220px;
  background-color: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e4e7ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.response-box:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(64, 158, 255, 0.2);
}

.response-box span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  position: relative;
  z-index: 1;
}

.test-description {
  color: #606266;
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.5;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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
  content: '点击切换颜色 | ESC 退出';
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
  background: #f1f1f1;
  border-radius: 3px;
}

.screen-test::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.screen-test::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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
  
  .color-squares {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .response-box {
    width: 180px;
    height: 180px;
  }
}
</style>