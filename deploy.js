#!/usr/bin/env node

/**
 * 自动化部署脚本到 Vercel
 * 使用方法: node deploy.js [dev|prod]
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// 输出带颜色的文本
function log(message, color = 'reset') {
  console.log(`${colors[color]}${colors.reset} ${message}`);
}

// 检查环境
async function checkEnvironment() {
  log('检查部署环境...', 'blue');

  // 检查是否安装了 Vercel CLI
  try {
    await execAsync('vercel --version');
    log('✓ Vercel CLI 已安装', 'green');
  } catch (error) {
    log('✗ Vercel CLI 未安装', 'red');
    log('请运行: npm install -g vercel', 'yellow');
    process.exit(1);
  }

  // 检查是否有 package.json
  if (!fs.existsSync('package.json')) {
    log('✗ 未找到 package.json', 'red');
    process.exit(1);
  }

  // 检查是否有 node_modules
  if (!fs.existsSync('node_modules')) {
    log('✗ 未找到 node_modules', 'yellow');
    log('正在安装依赖...', 'blue');
    await execAsync('npm install');
    log('✓ 依赖安装完成', 'green');
  }
}

// 构建项目
async function buildProject() {
  log('开始构建项目...', 'blue');

  try {
    await execAsync('npm run build');
    log('✓ 项目构建成功', 'green');

    // 检查 dist 目录
    if (!fs.existsSync('dist')) {
      throw new Error('dist 目录未生成');
    }

    log(`✓ 构建产物位于: ${path.join(process.cwd(), 'dist')}`, 'green');
  } catch (error) {
    log(`✗ 项目构建失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 部署到 Vercel
async function deployToVercel(env = 'dev') {
  log(`开始部署到 Vercel ${env} 环境...`, 'blue');

  const args = env === 'prod' ? ['--prod'] : [];

  try {
    await execAsync(`vercel ${args.join(' ')}`);
    log(`✓ 部署到 Vercel ${env} 环境成功！`, 'green');
  } catch (error) {
    log(`✗ 部署失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 显示部署信息
function showDeploymentInfo() {
  log('\n=== 部署信息 ===', 'blue');
  log('项目类型: Vue + Vite + Tailwind CSS', 'green');
  log('构建命令: npm run build', 'green');
  log('输出目录: dist/', 'green');
  log('Vercel 配置: vercel.json', 'green');
  log('\n使用说明:', 'blue');
  log('开发环境部署: node deploy.js dev', 'yellow');
  log('生产环境部署: node deploy.js prod', 'yellow');
}

// 主函数
async function main() {
  // 获取命令行参数
  const env = process.argv[2] || 'dev';

  if (env !== 'dev' && env !== 'prod') {
    log('无效的部署环境参数', 'red');
    log('使用方法: node deploy.js [dev|prod]', 'yellow');
    process.exit(1);
  }

  log('=== Vercel 自动化部署工具 ===', 'blue');

  try {
    // 1. 检查环境
    await checkEnvironment();

    // 2. 构建项目
    await buildProject();

    // 3. 部署到 Vercel
    await deployToVercel(env);

    // 4. 显示部署信息
    showDeploymentInfo();

    log('\n🎉 部署完成！', 'green');
  } catch (error) {
    log(`\n❌ 部署失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行主函数
main();