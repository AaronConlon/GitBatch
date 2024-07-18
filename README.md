


# GitHub Repository Manager

![GitHub stars](https://img.shields.io/github/stars/yourusername/your-repo-name?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/your-repo-name?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/your-repo-name)
![GitHub license](https://img.shields.io/github/license/yourusername/your-repo-name)
![Node.js Version](https://img.shields.io/badge/node-v20.14.0-brightgreen)
![Rush.js](https://img.shields.io/badge/rushjs-✓-blue)
![Next.js](https://img.shields.io/badge/nextjs-✓-black)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-✓-38B2AC)
![GitHub API](https://img.shields.io/badge/github%20api-✓-181717)
![Prettier](https://img.shields.io/badge/prettier-✓-F7B93E)
![Commitlint](https://img.shields.io/badge/commitlint-✓-green)

GitHub Repository Manager 是一个强大的工具，用于批量管理您的 GitHub 仓库。通过 GitHub OAuth 认证，您可以快速删除、修改和管理您的仓库。

## 主要功能

- 通过 GitHub OAuth 进行用户认证
- 批量快速删除 GitHub 仓库
- 修改仓库信息（如私有/公开状态、归档状态等）
- 用户友好的界面，方便操作

## 技术栈

- [Rush.js](https://rushjs.io/): 用于构建和管理项目
- [Next.js](https://nextjs.org/): React 框架，用于构建用户界面
- [Tailwind CSS](https://tailwindcss.com/): 用于快速设计和定制应用程序的外观
- [GitHub REST API](https://docs.github.com/en/rest): 用于与 GitHub 进行交互
- [Prettier](https://prettier.io/): 代码格式化工具
- [Commitlint](https://commitlint.js.org/): Git commit 消息规范检查工具

## 安装

确保您的系统已安装 Node.js v20.14.0 或更高版本。

1. 克隆仓库：
   ```
   git clone https://github.com/yourusername/your-repo-name.git
   ```

2. 进入项目目录：
   ```
   cd your-repo-name
   ```

3. 安装依赖：
   ```
   rush update
   ```

4. 进入 v-next 目录，启动开发服务器：
   ```
   rush dev
   ```

## 使用方法

1. 访问应用程序的 URL（本地开发时通常为 `http://localhost:3000`）
2. 使用 GitHub 账号登录
3. 授权应用程序访问您的 GitHub 仓库
4. 使用界面管理您的仓库

## 贡献

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多信息。

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

