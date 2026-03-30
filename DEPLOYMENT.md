# 部署指南

## 项目部署步骤

### 方法一：使用 Vercel CLI 部署（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **使用自动化脚本部署**
   - **开发环境**（预览部署）:
     ```bash
     node deploy.js dev
     ```
   - **生产环境**（正式部署）:
     ```bash
     node deploy.js prod
     ```

### 方法二：手动部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到 Vercel**
   - 开发环境: `vercel`
   - 生产环境: `vercel --prod`

### 方法三：使用 Vercel 网页版部署

1. **访问 Vercel 官网**
   - 打开 https://vercel.com
   - 登录或注册 Vercel 账号

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository" 或 "Upload"
   - 如果选择上传，上传整个项目文件夹

3. **配置部署**
   - 框架预设：选择 "Vue"
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 点击 "Deploy"

4. **访问部署后的应用**
   - 部署完成后，Vercel 会提供一个 URL
   - 点击该 URL 即可访问在线硬件测试工具

## 项目构建状态

项目已经成功构建，生成了 `dist` 目录，包含以下文件：

- `dist/index.html` - 主 HTML 文件
- `dist/assets/index-BYOKRZ2o.css` - 样式文件
- `dist/assets/index-OYlecnDx.js` - JavaScript 文件

## 自动化部署（CI/CD）

### 配置 GitHub Actions 自动部署

1. **在 GitHub 上配置 Vercel Secrets**
   - 进入 GitHub 仓库的 Settings > Secrets and variables
   - 添加以下 Secrets：
     - `VERCEL_TOKEN`: 你的 Vercel 访问令牌
     - `VERCEL_ORG_ID`: 你的 Vercel 组织 ID
     - `VERCEL_PROJECT_ID`: 你的 Vercel 项目 ID

2. **获取 Vercel 配置信息**
   - 安装 Vercel CLI: `npm install -g vercel`
   - 登录 Vercel: `vercel login`
   - 运行: `vercel env pull .env.development` 或 `vercel env pull .env.production`

3. **自动触发部署**
   - 每次推送到 main/master 分支会自动部署到生产环境
   - 每次 PR 推送到 main/master 分支会预览部署

### 本地自动化部署脚本

项目提供了 `deploy.js` 脚本，支持自动化部署：

```bash
# 开发环境部署（预览）
node deploy.js dev

# 生产环境部署（正式）
node deploy.js prod
```

脚本会自动：
- 检查并安装依赖
- 构建项目
- 部署到 Vercel

## 注意事项

1. **环境要求**
   - Node.js >= 16.0.0
   - npm >= 8.0.0

2. **部署配置**
   - 确保 `vercel.json` 文件存在于项目根目录
   - 确保 `package.json` 中的构建脚本正确配置

3. **浏览器兼容性**
   - 部署后的应用支持 Chrome >= 90、Firefox >= 88、Edge >= 90、Safari >= 14

4. **权限说明**
   - 麦克风和摄像头测试需要用户授权
   - 屏幕检测功能需要全屏权限

## 故障排除

1. **构建失败**
   - 检查依赖是否安装正确：`npm install`
   - 检查代码是否有语法错误

2. **部署失败 - 权限错误**
   - 错误信息：`sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied`
   - 解决方案：
     - 已将 Vite 版本从 6.0.1 降级到 5.4.10，避免版本兼容性问题
     - 已修改 `package.json` 中的构建脚本，使用 `node --loader=vite/dist/node/cli.js build` 来避免权限问题
     - 确保 Vercel 配置正确，构建命令设置为 `npm run build`

3. **部署失败 - 其他原因**
   - 检查 Vercel 配置是否正确
   - 检查项目结构是否符合 Vercel 要求
   - 查看 Vercel 部署日志获取详细错误信息

4. **应用无法访问**
   - 检查 Vercel 部署状态
   - 检查网络连接
   - 清除浏览器缓存
