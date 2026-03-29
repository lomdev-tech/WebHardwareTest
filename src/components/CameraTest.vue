<template>
  <div class="camera-test">
    <div class="test-section">
      <h3>摄像头测试</h3>
      <div class="camera-container">
        <video ref="videoElement" class="camera-feed" autoplay></video>
        <div v-if="!isCameraActive" class="camera-placeholder">
          <el-icon class="camera-icon"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></el-icon>
          <p>摄像头未激活</p>
          <el-button type="primary" @click="startTest" :disabled="isTesting">开始测试</el-button>
        </div>
      </div>
      <div class="test-controls">
        <el-button type="primary" @click="startTest" :disabled="isTesting || isCameraActive">开始测试</el-button>
        <el-button type="danger" @click="stopTest" :disabled="!isTesting">停止测试</el-button>
      </div>
    </div>
    
    <div class="info-section">
      <h4>摄像头信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="状态">{{ isCameraActive ? '已激活' : '未激活' }}</el-descriptions-item>
        <el-descriptions-item label="测试状态">{{ isTesting ? '测试中' : '未测试' }}</el-descriptions-item>
        <el-descriptions-item label="摄像头名称">{{ cameraName || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="分辨率">{{ resolution || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="测试时长" :span="2">{{ testDuration }} 秒</el-descriptions-item>
      </el-descriptions>
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
    ElMessage.error('无法访问摄像头，请检查权限设置')
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
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
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

.camera-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 24px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  min-height: 450px;
}

.camera-container:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border-color: #d9ecff;
}

.camera-feed {
  width: 100%;
  height: 100%;
  min-height: 450px;
  display: block;
  border-radius: 10px;
  object-fit: cover;
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
  background-color: rgba(248, 249, 250, 0.95);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.camera-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.camera-placeholder:hover .camera-icon {
  color: #409eff;
  transform: scale(1.1);
}

.camera-placeholder p {
  margin-bottom: 24px;
  color: #909399;
  font-size: 16px;
  font-weight: 500;
}

.test-controls {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

.test-controls .el-button {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.test-controls .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-section {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.info-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.info-section h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 12px;
}

.el-descriptions {
  border-radius: 8px;
  overflow: hidden;
}

.el-descriptions__header {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.el-descriptions__body {
  background-color: #ffffff;
}

.el-descriptions__item {
  padding: 16px;
  border-bottom: 1px solid #f0f2f5;
  border-right: 1px solid #f0f2f5;
}

.el-descriptions__item:last-child {
  border-right: none;
}

.el-descriptions__label {
  font-weight: 500;
  color: #606266;
}

.el-descriptions__content {
  font-weight: 500;
  color: #303133;
}

.tips-section {
  background-color: #ecf5ff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #d9ecff;
  transition: all 0.3s ease;
}

.tips-section:hover {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.tips-section h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #409eff;
  font-size: 16px;
  font-weight: 600;
}

.tips-section ul {
  padding-left: 20px;
  margin: 0;
}

.tips-section li {
  margin-bottom: 10px;
  color: #606266;
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
  background-color: #409eff;
  border-radius: 50%;
}

/* 滚动条样式 */
.camera-test::-webkit-scrollbar {
  width: 6px;
}

.camera-test::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.camera-test::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.camera-test::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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
  
  .test-controls .el-button {
    width: 100%;
  }
  
  .el-descriptions {
    :column="1"
  }
}
</style>