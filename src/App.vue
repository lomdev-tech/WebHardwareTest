<template>
  <div class="flex h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white overflow-hidden">
    <!-- 侧边栏 -->
    <aside 
      :class="[
        'relative flex flex-col bg-dark-800/90 border-r border-dark-700/50 transition-all duration-300',
        isCollapse ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-20 border-b border-dark-700/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <span v-if="!isCollapse" class="text-lg font-bold text-gradient">硬件检测</span>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <div
          v-for="item in menuItems"
          :key="item.key"
          @click="activeMenu = item.key"
          :class="[
            'nav-item',
            activeMenu === item.key ? 'active' : ''
          ]"
        >
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="activeMenu === item.key ? 'bg-primary-500/20' : 'bg-dark-700/50'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
            </svg>
          </div>
          <span v-if="!isCollapse" class="font-medium">{{ item.label }}</span>
        </div>
      </nav>

      <!-- 折叠按钮 -->
      <button 
        @click="toggleCollapse"
        class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-500 hover:bg-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-110"
      >
        <svg 
          class="w-4 h-4 text-white transition-transform duration-300"
          :class="isCollapse ? 'rotate-180' : ''"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 顶部标题栏 -->
      <header class="flex items-center justify-between h-20 px-8 border-b border-dark-700/50 bg-dark-800/50">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-white">
            {{ currentMenuItem?.label }}
          </h1>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
            在线测试
          </span>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-dark-500">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm">系统正常</span>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="glass-card min-h-full p-8">
          <!-- 动态组件 -->
          <component :is="currentComponent" ref="currentComponentRef" v-if="currentComponent" />
          <div v-else class="flex items-center justify-center h-full text-dark-500">
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              </div>
              <p>加载中...</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 重置按钮 -->
    <button 
      @click="resetTest"
      class="fixed bottom-8 right-8 w-14 h-14 rounded-full glow-btn flex items-center justify-center group"
    >
      <svg class="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const activeMenu = ref('keyboard')
const isCollapse = ref(false)
const currentComponent = ref(null)
const currentComponentRef = ref(null)
const loadedComponents = ref({})

const menuItems = [
  { 
    key: 'keyboard', 
    label: '键盘测试',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  { 
    key: 'mouse', 
    label: '鼠标测试',
    icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122'
  },
  { 
    key: 'screen', 
    label: '屏幕检测',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  { 
    key: 'mic', 
    label: '麦克风测试',
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
  },
  { 
    key: 'camera', 
    label: '摄像头测试',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
  }
]

const currentMenuItem = computed(() => menuItems.find(item => item.key === activeMenu.value))

// 动态加载组件
const loadComponent = async (menuKey) => {
  if (loadedComponents.value[menuKey]) {
    currentComponent.value = loadedComponents.value[menuKey]
    return
  }

  try {
    let component
    switch (menuKey) {
      case 'keyboard':
        component = (await import('./components/KeyboardTest.vue')).default
        break
      case 'mouse':
        component = (await import('./components/MouseTest.vue')).default
        break
      case 'screen':
        component = (await import('./components/ScreenTest.vue')).default
        break
      case 'mic':
        component = (await import('./components/MicTest.vue')).default
        break
      case 'camera':
        component = (await import('./components/CameraTest.vue')).default
        break
      default:
        component = null
    }
    if (component) {
      loadedComponents.value[menuKey] = component
      currentComponent.value = component
      // 等待组件挂载
      await nextTick()
    }
  } catch (error) {
    console.error('Failed to load component:', error)
    currentComponent.value = null
  }
}

// 监听菜单变化
watch(activeMenu, (newMenu) => {
  loadComponent(newMenu)
}, { immediate: true })

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const resetTest = () => {
  if (currentComponentRef.value && currentComponentRef.value.reset) {
    currentComponentRef.value.reset()
  }
}
</script>
