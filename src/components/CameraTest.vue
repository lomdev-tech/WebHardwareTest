<template>
  <div class="camera-test">
    <div class="test-section">
      <h3>摄像头测试</h3>
      <div class="camera-container">
        <video ref="videoElement" class="camera-feed" autoplay></video>
        <div v-if="!isCameraActive" class="camera-placeholder">
          <div class="camera-icon">
            <svg viewBox="0 0 24 24" class="w-16 h-16">
              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <p>摄像头未激活</p>
          <button @click="startTest" :disabled="isTesting" class="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
            开始测试
          </button>
        </div>
      </div>
      <div class="test-controls">
        <button @click="startTest" :disabled="isTesting || isCameraActive" class="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
          开始测试
        </button>
        <button @click="stopTest" :disabled="!isTesting" class="px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
          停止测试
        </button>
      </div>
    </div>
    
    <div class="info-section">
      <h4>摄像头信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">状态:</span>
          <span class="info-value">{{ isCameraActive ? '已激活' : '未激活' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">测试状态:</span>
          <span class="info-value">{{ isTesting ? '测试中' : '未测试' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">摄像头名称:</span>
          <span class="info-value">{{ cameraName || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">分辨率:</span>
          <span class="info-value">{{ resolution || '未知' }}</span>
        </div>
        <div class="info-item info-item-full">
          <span class="info-label">测试时长:</span>
          <span class="info-value">{{ testDuration }} 秒</span>
        </div>
      </div>
    </div>
    
    <div class="tips-section">
      <h4>使用说明</h4>
      <ul>
        <li>点击"开始测试"按钮启动摄像头</li>
        <li>观察视频画面是否清晰流畅</li>
        <li>测试完成后点击"停止测试"按钮</li>
        <li>如果无法启动摄像头，请检查浏览器权限设置</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const videoElement = ref(null)
const isCameraActive = ref(false)
const isTesting = ref(false)
const cameraName = ref('')
const resolution = ref('')
const testDuration = ref(0)
let stream = null
let timer = null

const startTest = async () => {
  try {
    // 请求摄像头权限
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    
    // 显示视频流
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      isCameraActive.value = true
      isTesting.value = true
      
      // 获取摄像头信息
      const track = stream.getVideoTracks()[0]
      const settings = track.getSettings()
      cameraName.value = track.label || '默认摄像头'
      resolution.value = `${settings.width} x ${settings.height}`
      
      // 开始计时
      testDuration.value = 0
      timer = setInterval(() => {
        testDuration.value++
      }, 1000)
    }
  } catch (error) {
    console.error('无法访问摄像头:', error)
    alert('无法访问摄像头，请检查权限设置')
  }
}

const stopTest = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
  
  isCameraActive.value = false
  isTesting.value = false
  
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const reset = () => {
  stopTest()
  testDuration.value = 0
  cameraName.value = ''
  resolution.value = ''
}

onUnmounted(() => {
  stopTest()
})

defineExpose({
  reset
})
</script>

<style scoped>
.camera-test {
  padding: 32px;
  min-height: calc(100vh - 100px);
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.test-section {
  @apply glass-card p-6 mb-6 border border-dark-700/50 transition-all duration-300 hw-accel;
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

.camera-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 24px;
  border: 2px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  background-color: #0f172a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-height: 450px;
}

.camera-container:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  border-color: #38bdf8;
}

.camera-feed {
  width: 100%;
  height: 100%;
  min-height: 450px;
  display: block;
  border-radius: 10px;
  object-fit: contain;
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 23, 42, 0.95);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.camera-icon {
  color: #64748b;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.camera-placeholder:hover .camera-icon {
  color: #38bdf8;
  transform: scale(1.1);
}

.camera-placeholder p {
  margin-bottom: 24px;
  color: #94a3b8;
  font-size: 16px;
  font-weight: 500;
}

.test-controls {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

.test-controls button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.info-section {
  @apply glass-card p-6 mb-6 border border-dark-700/50 transition-all duration-300 hw-accel;
}

.info-section:hover {
  @apply border-primary-500/30;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
}

.info-section h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  @apply flex justify-between items-center p-4 rounded-lg border border-dark-600 bg-dark-700/50 transition-all duration-300;
}

.info-item-full {
  grid-column: span 2;
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

.tips-section {
  @apply p-6 rounded-lg border border-primary-500/30 bg-primary-500/10 transition-all duration-300;
}

.tips-section:hover {
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
}

.tips-section h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #38bdf8;
  font-size: 16px;
  font-weight: 600;
}

.tips-section ul {
  padding-left: 20px;
  margin: 0;
}

.tips-section li {
  margin-bottom: 10px;
  color: #a1a1aa;
  line-height: 1.5;
  position: relative;
  padding-left: 12px;
}

.tips-section li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  background-color: #38bdf8;
  border-radius: 50%;
}

/* 滚动条样式 */
.camera-test::-webkit-scrollbar {
  width: 6px;
}

.camera-test::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 3px;
}

.camera-test::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.camera-test::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

@media (max-width: 768px) {
  .camera-test {
    padding: 24px;
  }
  
  .camera-container {
    max-width: 100%;
  }
  
  .test-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .test-controls button {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item-full {
    grid-column: span 1;
  }
}
</style>