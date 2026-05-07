# 家庭库存 PWA

一个自用的家庭库存记录 PWA，用来记录护肤品、彩妆、厨房调料等物品，减少重复购买，并提醒即将过期的库存。

## 本地开发

```bash
npm install
npm run dev -- --host 0.0.0.0
```

电脑本机打开：

```text
http://localhost:5173/
```

手机和电脑在同一个 Wi-Fi 时，打开 Vite 输出的 Network 地址，例如：

```text
http://192.168.0.107:5173/
```

## GitHub Pages 部署

这个项目使用 GitHub Actions 自动部署到 GitHub Pages。

首次部署步骤：

1. 在 GitHub 新建仓库，推荐仓库名：`home-inventory-pwa`。
2. 将本地代码 push 到仓库的 `main` 分支。
3. 打开仓库的 `Settings -> Pages`。
4. `Build and deployment` 选择 `GitHub Actions`。
5. 等待 `Deploy GitHub Pages` workflow 跑完。
6. 部署地址通常是：

```text
https://si-yu-aa.github.io/home-inventory-pwa/
```

## 数据隐私

库存数据保存在当前浏览器的 `localStorage` 里，不会自动上传到 GitHub。

不要把导出的备份 JSON 提交到仓库。`.gitignore` 已经忽略常见备份文件名：

```text
home-inventory-*.json
inventory-backup-*.json
```

## 验证

```bash
npm run lint
npm test
npm run build
GITHUB_PAGES=true npm run build
```
