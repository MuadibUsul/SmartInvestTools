# GitHub Actions 部署到当前服务器

这套部署链路已经改成下面的方式：

1. GitHub Actions 在 `master` 分支触发。
2. Action 在 GitHub Runner 上执行 `npm ci` 和 `npm run build`。
3. 构建产物使用 Next.js `standalone` 模式打包成压缩包。
4. 压缩包和部署脚本通过 SSH 上传到服务器。
5. 服务器把新版本解压到 `releases/<release-name>`。
6. `current` 软链接切到新版本，然后由 PM2 重载服务。

服务器目录结构如下：

```text
/var/www/smartinvesttools
├─ current -> /var/www/smartinvesttools/releases/release-xxx
├─ incoming
├─ releases
└─ shared
   └─ .env.production
```

## 你要做的事

### 1. 服务器只做一次初始化

以下说明默认服务器是 Linux。

先确认 Node.js 版本满足 `>= 20.9.0`：

```bash
node -v
npm -v
```

如果没有 Node.js，就先安装 Node 20 LTS。然后创建部署目录：

```bash
mkdir -p /var/www/smartinvesttools/incoming
mkdir -p /var/www/smartinvesttools/releases
mkdir -p /var/www/smartinvesttools/shared
```

确保 `DEPLOY_USERNAME` 对这个目录有读写权限。如果你使用的是单独的部署用户，记得把目录所有者改给它。

如果你的站点以后需要环境变量，把生产环境变量放到：

```bash
/var/www/smartinvesttools/shared/.env.production
```

部署脚本会在每次发布时自动把它复制到当前版本目录。

### 2. 准备 GitHub Actions 登录服务器的 SSH Key

生成一对专用密钥，建议不要复用你平时登录服务器的密钥。

把公钥追加到目标用户的 `~/.ssh/authorized_keys`。

把私钥完整内容放到 GitHub 仓库的 Secret：

```text
DEPLOY_SSH_PRIVATE_KEY
```

### 3. 在 GitHub 仓库里设置 Secrets

进入仓库：

`Settings -> Secrets and variables -> Actions`

新增这些 `Secrets`：

```text
DEPLOY_HOST
DEPLOY_USERNAME
DEPLOY_SSH_PRIVATE_KEY
```

### 4. 在 GitHub 仓库里设置 Variables

新增这些 `Variables`，不填就会使用默认值：

```text
APP_NAME=smartinvesttools
APP_PORT=3010
DEPLOY_PATH=/var/www/smartinvesttools
DEPLOY_PORT=22
NODE_VERSION=20.19.0
```

### 5. 如果你要通过域名访问，确认反向代理

应用默认监听 `3010` 端口。你需要让 Nginx 或 Caddy 反代到这个端口。

一个最小的 Nginx 示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. 触发部署

两种方式都可以：

1. 推送代码到 `master`。
2. 打开 GitHub 的 `Actions` 页面，手动运行 `Deploy Smart Invest Tools`。

## 现在仓库里的关键点

- `next.config.ts` 已开启 `output: "standalone"`。
- `.github/workflows/deploy.yml` 已改成构建产物上传发布，不再在服务器上 `git reset --hard`。
- `scripts/deploy-release.sh` 负责服务器上的解压、切换软链接、重载 PM2。
- `ecosystem.config.cjs` 已改成直接运行 `server.js`，适配 standalone 部署。
