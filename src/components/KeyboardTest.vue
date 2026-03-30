<template>
  <div class="flex flex-col items-center gap-8 p-8 w-full">
    <!-- 统计信息 -->
    <div class="flex gap-6 w-full max-w-6xl">
      <div class="data-card flex-1 flex items-center justify-between hw-accel">
        <div>
          <p class="text-dark-500 text-sm mb-1">已测试按键</p>
          <p class="text-3xl font-bold text-gradient">{{ testedKeys.size }}</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <div class="data-card flex-1 flex items-center justify-between hw-accel">
        <div>
          <p class="text-dark-500 text-sm mb-1">当前按下</p>
          <p class="text-3xl font-bold text-white">{{ pressedKeys.size }}</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
      </div>
      <div class="data-card flex-1 flex items-center justify-between hw-accel">
        <div>
          <p class="text-dark-500 text-sm mb-1">测试进度</p>
          <p class="text-3xl font-bold text-primary-300">{{ Math.round((testedKeys.size / 104) * 100) }}%</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 键盘 -->
    <div class="glass-card p-6 w-full max-w-6xl overflow-x-auto hw-accel">
      <div class="flex flex-col gap-2 min-w-max">
        <!-- 第一行 -->
        <div class="flex gap-1.5">
          <div class="key-cap w-14 h-14" :class="getKeyClass('Escape')">Esc</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F1')">F1</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F2')">F2</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F3')">F3</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F4')">F4</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F5')">F5</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F6')">F6</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F7')">F7</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F8')">F8</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F9')">F9</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F10')">F10</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F11')">F11</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('F12')">F12</div>
          <div class="w-4"></div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('PrintScreen')">PrtSc</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('ScrollLock')">ScrLk</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('Pause')">Pause</div>
        </div>

        <!-- 第二行 -->
        <div class="flex gap-1.5">
          <div class="key-cap w-14 h-14" :class="getKeyClass('Backquote')">`</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit1')">1</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit2')">2</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit3')">3</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit4')">4</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit5')">5</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit6')">6</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit7')">7</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit8')">8</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit9')">9</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Digit0')">0</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Minus')">-</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Equal')">=</div>
          <div class="key-cap w-20 h-14" :class="getKeyClass('Backspace')">←</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('Insert')">Ins</div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('Home')">Home</div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('PageUp')">PgUp</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('NumLock')">Num</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('NumpadDivide')">/</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('NumpadMultiply')">*</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('NumpadSubtract')">-</div>
        </div>

        <!-- 第三行 -->
        <div class="flex gap-1.5">
          <div class="key-cap w-20 h-14" :class="getKeyClass('Tab')">Tab</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyQ')">Q</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyW')">W</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyE')">E</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyR')">R</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyT')">T</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyY')">Y</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyU')">U</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyI')">I</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyO')">O</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyP')">P</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('BracketLeft')">[</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('BracketRight')">]</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Backslash')">\</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('Delete')">Del</div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('End')">End</div>
          <div class="key-cap w-14 h-14 text-xs" :class="getKeyClass('PageDown')">PgDn</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad7')">7</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad8')">8</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad9')">9</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('NumpadAdd')">+</div>
        </div>

        <!-- 第四行 -->
        <div class="flex gap-1.5">
          <div class="key-cap w-24 h-14" :class="getKeyClass('CapsLock')">Caps</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyA')">A</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyS')">S</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyD')">D</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyF')">F</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyG')">G</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyH')">H</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyJ')">J</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyK')">K</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyL')">L</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Semicolon')">;</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Quote')">'</div>
          <div class="key-cap w-24 h-14" :class="getKeyClass('Enter')">Enter</div>
          <div class="w-[100px]"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad4')">4</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad5')">5</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad6')">6</div>
        </div>

        <!-- 第五行 -->
        <div class="flex gap-1.5">
          <div class="key-cap w-28 h-14" :class="getKeyClass('ShiftLeft')">Shift</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyZ')">Z</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyX')">X</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyC')">C</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyV')">V</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyB')">B</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyN')">N</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('KeyM')">M</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Comma')">,</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Period')">.</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Slash')">/</div>
          <div class="key-cap w-28 h-14" :class="getKeyClass('ShiftRight')">Shift</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('ArrowUp')">↑</div>
          <div class="w-[52px]"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad1')">1</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad2')">2</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('Numpad3')">3</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('NumpadEnter')">↵</div>
        </div>

        <!-- 第六行 -->
        <div class="flex gap-1.5">
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('ControlLeft')">Ctrl</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('MetaLeft')">Win</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('AltLeft')">Alt</div>
          <div class="key-cap w-64 h-14" :class="getKeyClass('Space')">Space</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('AltRight')">Alt</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('ContextMenu')">Menu</div>
          <div class="key-cap w-16 h-14 text-xs" :class="getKeyClass('ControlRight')">Ctrl</div>
          <div class="w-4"></div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('ArrowLeft')">←</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('ArrowDown')">↓</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('ArrowRight')">→</div>
          <div class="w-[52px]"></div>
          <div class="key-cap w-28 h-14" :class="getKeyClass('Numpad0')">0</div>
          <div class="key-cap w-14 h-14" :class="getKeyClass('NumpadDecimal')">.</div>
        </div>
      </div>
    </div>

    <!-- 说明 -->
    <div class="glass-card p-6 w-full max-w-2xl text-center hw-accel">
      <p class="text-dark-500 mb-2">按下键盘上的任意键，对应的虚拟键位会高亮显示</p>
      <p class="text-primary-400">已测试的键位会保持蓝色高亮状态</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

// 使用 Set 存储按键状态，查找时间 O(1)
const pressedKeys = ref(new Set())
const testedKeys = ref(new Set())

// 优化 getKeyClass 函数，减少重复计算
const getKeyClass = (keyCode) => {
  const classes = []
  if (pressedKeys.value.has(keyCode)) {
    classes.push('active')
  }
  if (testedKeys.value.has(keyCode)) {
    classes.push('tested')
  }
  return classes.join(' ')
}

const handleKeyDown = (event) => {
  event.preventDefault()
  const key = event.code
  if (!pressedKeys.value.has(key)) {
    pressedKeys.value.add(key)
  }
  if (!testedKeys.value.has(key)) {
    testedKeys.value.add(key)
  }
}

const handleKeyUp = (event) => {
  event.preventDefault()
  const key = event.code
  if (pressedKeys.value.has(key)) {
    pressedKeys.value.delete(key)
  }
}

const reset = () => {
  pressedKeys.value.clear()
  testedKeys.value.clear()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

defineExpose({
  reset
})
</script>
