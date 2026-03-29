// 获取DOM元素
const mouseTestArea = document.getElementById('mouseTestArea');
const keyboardTestArea = document.getElementById('keyboardTestArea');
const mouseEventDisplay = document.getElementById('mouseEventDisplay');
const keyboardEventDisplay = document.getElementById('keyboardEventDisplay');

// 鼠标按键元素
const mouseLeft = document.getElementById('mouseLeft');
const mouseMiddle = document.getElementById('mouseMiddle');
const mouseRight = document.getElementById('mouseRight');
const mouseSide1 = document.getElementById('mouseSide1');
const mouseSide2 = document.getElementById('mouseSide2');
const mouseWheel = document.getElementById('mouseWheel');

// 生成随机颜色
function generateColor(input) {
    // 使用输入值生成哈希值
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 将哈希值转换为HSL颜色，确保颜色更加鲜明
    const hue = (hash % 360 + 360) % 360;
    const saturation = 70 + (hash % 30); // 70-100%
    const lightness = 45 + (hash % 10); // 45-55%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// 添加脉冲动画效果
function addPulseEffect(element) {
    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, 500);
}

// 激活鼠标按键
function activateMouseButton(buttonElement) {
    buttonElement.classList.add('active');
    buttonElement.classList.add('glow');
    setTimeout(() => {
        buttonElement.classList.remove('active');
        buttonElement.classList.remove('glow');
    }, 1000);
}

// 处理键盘事件
function handleKeyEvent(event) {
    const key = event.key;
    const keyCode = event.keyCode;
    
    // 生成颜色
    const color = generateColor(key + keyCode);
    
    // 更新显示
    keyboardEventDisplay.textContent = `键盘按键: ${key} (${keyCode})`;
    keyboardTestArea.style.backgroundColor = color;
    
    // 添加动画效果
    addPulseEffect(keyboardTestArea);
}

// 处理鼠标移动事件
function handleMouseMove(event) {
    const x = event.clientX;
    const y = event.clientY;
    
    // 生成颜色
    const color = generateColor(`mouse${x}${y}`);
    
    // 更新显示
    mouseEventDisplay.textContent = `鼠标移动: (${x}, ${y})`;
    mouseTestArea.style.backgroundColor = color;
}

// 处理鼠标点击事件
function handleMouseClick(event) {
    const button = event.button;
    const buttons = ['左键', '中键', '右键'];
    const buttonName = buttons[button] || `按钮 ${button}`;
    
    // 生成颜色
    const color = generateColor(`click${button}`);
    
    // 更新显示
    mouseEventDisplay.textContent = `鼠标点击: ${buttonName}`;
    mouseTestArea.style.backgroundColor = color;
    
    // 激活对应的鼠标按键
    switch(button) {
        case 0:
            activateMouseButton(mouseLeft);
            break;
        case 1:
            activateMouseButton(mouseMiddle);
            break;
        case 2:
            activateMouseButton(mouseRight);
            break;
    }
    
    // 添加动画效果
    addPulseEffect(mouseTestArea);
}

// 处理鼠标滚轮事件
function handleMouseWheel(event) {
    const delta = event.deltaY > 0 ? '向下' : '向上';
    
    // 生成颜色
    const color = generateColor(`wheel${delta}`);
    
    // 更新显示
    mouseEventDisplay.textContent = `鼠标滚轮: ${delta}`;
    mouseTestArea.style.backgroundColor = color;
    
    // 激活鼠标滚轮
    activateMouseButton(mouseWheel);
    
    // 添加动画效果
    addPulseEffect(mouseTestArea);
}

// 处理鼠标侧边按键事件
function handleMouseSideButtons(event) {
    const keyCode = event.keyCode;
    let buttonName = '';
    let buttonElement = null;
    
    if (keyCode === 37) { // 左箭头键 (侧边键1)
        buttonName = '侧边键1';
        buttonElement = mouseSide1;
    } else if (keyCode === 39) { // 右箭头键 (侧边键2)
        buttonName = '侧边键2';
        buttonElement = mouseSide2;
    }
    
    if (buttonName && buttonElement) {
        // 生成颜色
        const color = generateColor(`side${keyCode}`);
        
        // 更新显示
        mouseEventDisplay.textContent = `鼠标点击: ${buttonName}`;
        mouseTestArea.style.backgroundColor = color;
        
        // 激活对应的鼠标按键
        activateMouseButton(buttonElement);
        
        // 添加动画效果
        addPulseEffect(mouseTestArea);
    }
}

// 绑定事件监听器
window.addEventListener('keydown', handleKeyEvent);
window.addEventListener('keydown', handleMouseSideButtons); // 监听侧边键
mouseTestArea.addEventListener('mousemove', handleMouseMove);
mouseTestArea.addEventListener('click', handleMouseClick);
mouseTestArea.addEventListener('wheel', handleMouseWheel);

// 初始状态
console.log('在线键盘鼠标测试工具已就绪');
mouseEventDisplay.textContent = '准备就绪，请点击鼠标按键或滚动滚轮...';
keyboardEventDisplay.textContent = '准备就绪，请按下任意键盘按键...';
mouseTestArea.style.backgroundColor = '#fff';
keyboardTestArea.style.backgroundColor = '#fff';