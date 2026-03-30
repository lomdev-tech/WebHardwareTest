# 部署指南

## 项目部署步骤

### 方法一：使用 Vercel 网页版部署（推荐）

1. **访问 Vercel 官网**
   - 打开 https://vercel.com
   - 登录或注册 Vercel 账号

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository" 导入 GitHub 仓库
   - 或者选择 "Upload" 上传项目文件夹

3. **配置部署**
   - 框架预设：选择 "Vite"
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 安装命令：`npm install`
   - 点击 "Deploy"

4. **访问部署后的应用**
   - 部署完成后，Vercel 会提供一个 URL
   - 点击该 URL 即可访问在线硬件测试工具

### 方法二：使用 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署到 Vercel**
   ```bash
   vercel --prod
   ```

## 项目构建状态

项目已经成功构建，生成了 `dist` 目录，包含以下文件：

- `dist/index.html` - 主 HTML 文件
- `dist/assets/index-BYOKRZ2o.css` - 样式文件
- `dist/assets/index-OYlecnDx.js` - JavaScript 文件

## 配置说明

### Vercel 配置 (vercel.json)

项目已配置 `vercel.json` 文件，包含以下关键配置：

- **framework**: 指定使用 Vite 框架
- **buildCommand**: 构建命令为 `npm run build`
- **outputDirectory**: 输出目录为 `dist`
- **rewrites**: 配置了 SPA 路由重写，所有路由都指向 `index.html`

### 构建脚本 (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 注意事项

1. **环境要求**
   - Node.js >= 16.0.0
   - npm >= 8.0.0

2. **部署配置**
   - 确保 `vercel.json` 文件存在于项目根目录
   - 确保 `package.json` 中的构建脚本正确配置
   - Vite 版本已降级到 5.4.10，避免兼容性问题

3. **浏览器兼容性**
   - 部署后的应用支持 Chrome >= 90、Firefox >= 88、Edge >= 90、Safari >= 14

4. **权限说明**
   - 麦克风和摄像头测试需要用户授权
   - 屏幕检测功能需要全屏权限

## 故障排除

### 1. 构建失败

- 检查依赖是否安装正确：`npm install`
- 检查代码是否有语法错误
- 查看本地构建是否成功：`npm run build`

### 2. 部署失败 - 权限错误

- 错误信息：`sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied`
- 解决方案：
  - 确保 Vite 版本为 5.4.10 或更低版本
  - 确保 `vercel.json` 配置正确
  - 不要使用自定义的构建脚本路径

### 3. 部署失败 - 路径错误

- 错误信息：`ERR_PACKAGE_PATH_NOT_EXPORTED: Package subpath './dist/node/cli.js' is not defined`
- 解决方案：
  - 使用标准的 `vite build` 命令，不要使用自定义 loader
  - 确保 `package.json` 中的构建脚本正确

### 4. 部署失败 - 其他原因

- 检查 Vercel 配置是否正确
- 检查项目结构是否符合 Vercel 要求
- 查看 Vercel 部署日志获取详细错误信息
- 确保 `dist` 目录在构建后正确生成

### 5. 应用无法访问

- 检查 Vercel 部署状态
- 检查网络连接
- 清除浏览器缓存
- 检查浏览器控制台是否有错误信息

## 常见问题

### Q: 为什么部署后页面显示空白？
A: 检查浏览器控制台是否有错误，可能是路由配置问题或资源加载失败。

### Q: 麦克风和摄像头测试无法使用？
A: 确保浏览器已授予权限，并且使用 HTTPS 协议访问（Vercel 默认提供 HTTPS）。

### Q: 如何查看部署日志？
A: 在 Vercel 仪表板中选择对应的项目和部署，点击 "View Build Logs" 查看详细信息。
