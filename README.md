# SSH 执行命令的 Web 应用

这个项目是一个基于 Node.js 的简单 Web 应用，用于通过 SSH 连接到远程主机并执行命令。此分支**仅保留一个API接口**，用于其他项目调用，不包含前端界面。

## 功能

- 通过API发送命令
- 执行完成后返回所有命令执行结果
- 支持与远程主机建立 SSH 连接

## 技术栈

- Node.js
- Express.js - 用于构建 Web 服务器
- SSH2 - 用于 SSH 连接和命令执行

## 使用方法
### 本地部署

1. 克隆或下载本仓库到您的本地环境。
2. 在项目根目录下执行 `npm install` 命令安装依赖项。
3. 在项目根目录下执行 `node app.js` 命令启动应用。
4. 在浏览器中访问 `http://localhost:3000` 查看应用界面。
5. 使用以下示例命令测试应用功能：

   ```bash
   curl -X POST -d "command=your-command-value" http://your-domain.com/your-post-endpoint
   ```

请注意，使用 SSH 功能涉及到安全性和权限等问题，请谨慎处理和验证输入，以防止潜在的安全风险。

### PaaS 平台部署
可自行尝试部署到 Heroku、Vercel 等平台，

## 贡献

如果您发现任何问题或改进的机会，请随时创建问题或提交拉取请求。我们欢迎并感谢您的贡献！

## 许可证

本项目基于 [MIT 许可证](LICENSE)。
