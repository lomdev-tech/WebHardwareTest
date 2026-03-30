<template>
  <div class="mic-test">
    <div class="test-section">
      <h3>麦克风测试</h3>
      <div class="mic-container">
        <div class="mic-icon" :class="{ 'recording': isRecording, 'active': isActive }">
          <svg viewBox="0 0 24 24" class="mic-svg">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.92 3c-.45-.34-1.09-.54-1.75-.54H13v-2h3.17c.53 0 1.04-.21 1.41-.59l3.02-3.02c.2-.2.31-.46.31-.77 0-.55-.45-1-1-1s-1 .45-1 1c0 .11.04.21.1.3l-3.02 3.02c-.18.18-.43.28-.7.28H13v2h3.17c.66 0 1.3-.2 1.75-.54.19-.14.35-.31.47-.51.12-.2.21-.43.21-.68 0-.55-.45-1-1-1s-1 .45-1 1c0 .25.09.48.21.68.12.2.28.37.47.51z"/>
          </svg>
          <div class="mic-wave" v-if="isRecording">
            <span v-for="i in 5" :key="i" :style="{ animationDelay: i * 0.1 + 's' }"></span>
          </div>
        </div>
        <div class="mic-controls">
          <button @click="startTest" :disabled="isRecording" class="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
            开始测试
          </button>
          <button @click="stopTest" :disabled="!isRecording" class="flex-1 px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
            停止测试
          </button>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>测试结果</h3>
      <div class="test-results">
        <div class="result-item">
          <span class="result-label">麦克风状态:</span>
          <span class="result-value" :class="isActive ? 'active' : 'inactive'">
            {{ isActive ? '已连接' : '未连接' }}
          </span>
        </div>
        <div class="result-item">
          <span class="result-label">音量级别:</span>
          <span class="result-value">{{ volumeLevel }}%</span>
        </div>
        <div class="result-item">
          <span class="result-label">测试时间:</span>
          <span class="result-value">{{ testDuration }}秒</span>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>音频波形</h3>
      <div class="audio-waveform">
        <div class="waveform-container">
          <div class="waveform-bar" v-for="i in 30" :key="i" :style="{ height: getBarHeight(i) + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>使用说明</h3>
      <div class="instructions">
        <p>1. 点击"开始测试"按钮</p>
        <p>2. 对着麦克风说话或发出声音</p>
        <p>3. 观察音量级别和波形变化</p>
        <p>4. 点击"停止测试"按钮结束测试</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isRecording = ref(false)
const isActive = ref(false)
const volumeLevel = ref(0)
const testDuration = ref(0)
const audioContext = ref(null)
const mediaStream = ref(null)
const analyser = ref(null)
const dataArray = ref(null)
const animationFrame = ref(null)
const startTime = ref(0)
const timer = ref(null)

// 生成随机波形高度
const getBarHeight = (index) => {
  if (!isRecording.value) return 10
  return 10 + Math.random() * 80
}

// 开始测试
const startTest = async () => {
  try {
    // 请求麦克风权限
    mediaStream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    isActive.value = true
    isRecording.value = true
    startTime.value = Date.now()
    
    // 计算测试时间
    timer.value = setInterval(() => {
      testDuration.value = Math.floor((Date.now() - startTime.value) / 1000)
    }, 1000)
    
    // 初始化音频分析
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    const source = audioContext.value.createMediaStreamSource(mediaStream.value)
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = 256
    source.connect(analyser.value)
    
    // 获取音频数据
    const bufferLength = analyser.value.frequencyBinCount
    dataArray.value = new Uint8Array(bufferLength)
    
    // 分析音频数据
    const updateVolume = () => {
      if (!analyser.value) return
      
      analyser.value.getByteFrequencyData(dataArray.value)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray.value[i]
      }
      const average = sum / bufferLength
      volumeLevel.value = Math.min(Math.round((average / 255) * 100), 100)
      
      animationFrame.value = requestAnimationFrame(updateVolume)
    }
    
    updateVolume()
  } catch (error) {
    console.error('Error accessing microphone:', error)
    isActive.value = false
  }
}

// 停止测试
const stopTest = () => {
  isRecording.value = false
  
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
    animationFrame.value = null
  }
  
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }
  
  if (audioContext.value) {
    audioContext.value.close()
    audioContext.value = null
  }
  
  analyser.value = null
  dataArray.value = null
}

// 重置测试
const reset = () => {
  stopTest()
  isActive.value = false
  volumeLevel.value = 0
  testDuration.value = 0
}

// 检查麦克风是否可用
const checkMicAvailability = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop())
    isActive.value = true
  } catch (error) {
    console.error('Microphone not available:', error)
    isActive.value = false
  }
}

onMounted(() => {
  checkMicAvailability()
})

onUnmounted(() => {
  stopTest()
})

defineExpose({
  reset
})
</script>

<style scoped>
.mic-test {
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

.mic-container {
  @apply flex flex-col items-center gap-6 p-6 rounded-xl border border-dark-600 bg-dark-700/50;
}

.mic-icon {
  width: 140px;
  height: 140px;
  background-color: #1e293b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid #334155;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.mic-icon.active {
  border-color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.1);
  box-shadow: 0 4px 16px rgba(56, 189, 248, 0.3);
}

.mic-icon.recording {
  border-color: #4ade80;
  background-color: rgba(74, 222, 128, 0.1);
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
  animation: pulse 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(74, 222, 128, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
    transform: scale(1);
  }
}

.mic-svg {
  width: 65px;
  height: 65px;
  fill: #a1a1aa;
  transition: fill 0.3s ease;
}

.mic-icon.active .mic-svg {
  fill: #38bdf8;
}

.mic-icon.recording .mic-svg {
  fill: #4ade80;
  animation: micBounce 0.8s infinite alternate ease-in-out;
}

@keyframes micBounce {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

.mic-wave {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.mic-wave span {
  width: 4px;
  height: 18px;
  background-color: #38bdf8;
  border-radius: 2px;
  animation: wave 1s infinite ease-in-out;
  box-shadow: 0 2px 4px rgba(56, 189, 248, 0.3);
}

@keyframes wave {
  0%, 100% {
    height: 6px;
    opacity: 0.7;
  }
  50% {
    height: 18px;
    opacity: 1;
  }
}

.mic-controls {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 300px;
}

.mic-controls button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.test-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.result-item {
  @apply flex justify-between items-center p-4 rounded-lg border border-dark-600 bg-dark-700/50 transition-all duration-300;
}

.result-item:hover {
  @apply border-primary-500/50 bg-dark-700/80;
}

.result-label {
  color: #a1a1aa;
  font-weight: 500;
  font-size: 14px;
}

.result-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.result-value.active {
  color: #4ade80;
  font-weight: 700;
  transform: scale(1.05);
}

.result-value.inactive {
  color: #f87171;
}

.audio-waveform {
  @apply p-6 rounded-lg border border-dark-600 bg-dark-700/50;
}

.waveform-container {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 120px;
  justify-content: center;
  padding: 16px 0;
}

.waveform-bar {
  width: 6px;
  background-color: #38bdf8;
  border-radius: 3px;
  transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(56, 189, 248, 0.3);
}

.instructions {
  color: #a1a1aa;
  font-size: 14px;
  line-height: 1.6;
  @apply p-5 rounded-lg border border-dark-600 bg-dark-700/50;
}

.instructions p {
  margin: 8px 0;
  position: relative;
  padding-left: 20px;
}

.instructions p::before {
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
.mic-test::-webkit-scrollbar {
  width: 6px;
}

.mic-test::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 3px;
}

.mic-test::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.mic-test::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

@media (max-width: 768px) {
  .mic-test {
    padding: 24px;
  }
  
  .test-results {
    grid-template-columns: 1fr;
  }
  
  .mic-controls {
    flex-direction: column;
    width: 100%;
    max-width: none;
  }
  
  .mic-controls button {
    width: 100%;
  }
  
  .mic-icon {
    width: 120px;
    height: 120px;
  }
  
  .mic-svg {
    width: 55px;
    height: 55px;
  }
}
</style>