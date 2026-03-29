<template>
  <div class="mouse-test">
    <div class="mouse-container" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @wheel="handleWheel">
      <div class="mouse-model">
        <div class="logitech-mouse">
          <div class="mouse-body">
            <div class="mouse-head">
              <div class="mouse-buttons">
                <div class="mouse-button left-button" :class="{ 'active': mouseState.leftButton }"></div>
                <div class="mouse-button middle-button" :class="{ 'active': mouseState.middleButton }"></div>
                <div class="mouse-button right-button" :class="{ 'active': mouseState.rightButton }"></div>
              </div>
              <div class="mouse-wheel" :class="{ 'active': mouseState.middleButton }">
                <div class="wheel-track"></div>
              </div>
            </div>
            <div class="mouse-body-main">
              <div class="logitech-logo">LOGITECH</div>
              <div class="mouse-texture"></div>
            </div>
            <div class="mouse-tail"></div>
            <div class="mouse-side">
              <div class="mouse-button side-button forward-button" :class="{ 'active': mouseState.forwardButton }"></div>
              <div class="mouse-button side-button back-button" :class="{ 'active': mouseState.backButton }"></div>
              <div class="side-texture"></div>
            </div>
          </div>
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

const handleMouseDown = (event) => {
  event.preventDefault()
  
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
}

onMounted(() => {
  // 阻止右键菜单
  window.addEventListener('contextmenu', (e) => e.preventDefault())
})

onUnmounted(() => {
  window.removeEventListener('contextmenu', (e) => e.preventDefault())
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
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  cursor: crosshair;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.mouse-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.mouse-model {
  width: 480px;
  height: 280px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
}

.logitech-mouse {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotateY(15deg) rotateX(5deg);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.logitech-mouse:hover {
  transform: rotateY(10deg) rotateX(2deg) scale(1.02);
}

.mouse-body {
  width: 420px;
  height: 210px;
  background-color: #ffffff;
  border-radius: 40px 60px 20px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), inset 0 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.mouse-head {
  width: 100%;
  height: 85px;
  background-color: #ffffff;
  border-radius: 40px 60px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 45px;
  position: relative;
  border-bottom: 1px solid #f0f2f5;
}

.mouse-buttons {
  display: flex;
  align-items: center;
  gap: 2px;
  position: relative;
  z-index: 1;
}

.mouse-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: 8px;
}

.mouse-button.left-button {
  width: 95px;
  height: 52px;
  background-color: #f8f9fa;
  border-radius: 15px 0 0 0;
  border: 1px solid #e4e7ed;
}

.mouse-button.middle-button {
  width: 25px;
  height: 52px;
  background-color: #f8f9fa;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
}

.mouse-button.right-button {
  width: 95px;
  height: 52px;
  background-color: #f8f9fa;
  border-radius: 0 15px 0 0;
  border: 1px solid #e4e7ed;
}

.mouse-side {
  position: absolute;
  right: 0;
  top: 32px;
  bottom: 32px;
  width: 85px;
  background-color: #f8f9fa;
  border-radius: 0 20px 20px 0;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
}

.mouse-button.side-button {
  width: 32px;
  height: 48px;
  background-color: #e9ecef;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  position: relative;
  right: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mouse-button.side-button:hover {
  background-color: #e3f2fd;
  border-color: #bbdefb;
}

.forward-button {
  top: 0;
}

.back-button {
  top: 0;
}

.mouse-button.active {
  background-color: #67c23a;
  border-color: #67c23a;
  transform: translateY(3px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

.mouse-wheel {
  width: 32px;
  height: 65px;
  background-color: #f8f9fa;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4e7ed;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.mouse-wheel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to bottom,
    #e4e7ed 0px,
    #e4e7ed 2px,
    transparent 2px,
    transparent 4px
  );
  transition: all 0.3s ease;
}

.mouse-wheel:hover {
  background-color: #e3f2fd;
  border-color: #bbdefb;
}

.mouse-wheel.active {
  background-color: #67c23a;
  border-color: #67c23a;
}

.mouse-wheel.active::before {
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3) 0px,
    rgba(255, 255, 255, 0.3) 2px,
    transparent 2px,
    transparent 4px
  );
}

.wheel-track {
  width: 8px;
  height: 45px;
  background-color: #dee2e6;
  border-radius: 4px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.mouse-wheel.active .wheel-track {
  background-color: rgba(255, 255, 255, 0.7);
}

.mouse-body-main {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.logitech-logo {
  color: #303133;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.mouse-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
  opacity: 0.8;
}

.mouse-tail {
  width: 100%;
  height: 32px;
  background-color: #ffffff;
  border-radius: 0 0 20px 20px;
  position: relative;
  border-top: 1px solid #f0f2f5;
}

.mouse-tail::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 18px;
  background-color: #ffffff;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  border-top: none;
  transition: all 0.3s ease;
}

.side-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 8px,
    #e4e7ed 8px,
    #e4e7ed 9px
  );
  opacity: 0.4;
}

.mouse-status {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 650px;
  margin-bottom: 32px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.status-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d9ecff;
}

.status-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.status-value {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-value.active {
  color: #67c23a;
  font-weight: 700;
  transform: scale(1.05);
}

.instructions {
  text-align: center;
  color: #606266;
  font-size: 14px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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
  background: #f1f1f1;
  border-radius: 3px;
}

.mouse-test::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.mouse-test::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .mouse-test {
    padding: 24px;
  }
  
  .mouse-container {
    width: 100%;
    max-width: 420px;
    height: 380px;
  }
  
  .mouse-model {
    width: 380px;
    height: 220px;
  }
  
  .logitech-mouse {
    transform: rotateY(10deg) rotateX(3deg);
  }
  
  .mouse-body {
    width: 320px;
    height: 160px;
    border-radius: 30px 45px 15px 15px;
  }
  
  .mouse-head {
    height: 65px;
    padding: 0 32px;
  }
  
  .mouse-button.left-button,
  .mouse-button.right-button {
    width: 75px;
    height: 42px;
  }
  
  .mouse-button.middle-button {
    width: 22px;
    height: 42px;
  }
  
  .mouse-side {
    width: 65px;
    top: 22px;
    bottom: 22px;
    gap: 18px;
  }
  
  .mouse-button.side-button {
    width: 28px;
    height: 38px;
  }
  
  .mouse-wheel {
    width: 28px;
    height: 55px;
  }
  
  .logitech-logo {
    font-size: 15px;
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