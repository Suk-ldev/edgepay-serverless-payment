# EdgePay Serverless Payment（公开商业加密版）

这是可直接部署的商业发行仓库。公开内容仅包含经过压缩、符号收缩且不附带 Source Map 的 Worker 发行模块；完整插件开发源码与 License Worker 不在本仓库中。

## 安全结构

- License 响应使用固定 Ed25519 公钥验签，授权绑定域名、实例身份、插件权限、nonce 与 audience。
- 插件授权请求使用设备私钥签名和一次性 nonce，服务端通过 D1 防重放。
- 授权服务端点以 AES-GCM 密文固化，普通环境变量不能改写。
- 通道密钥和插件配置使用独立密钥派生的 AES-GCM 密文写入 D1。
- 本仓库不发布模块源码、Source Map、开发测试、构建脚本或 License 服务端代码。
- `COMMERCIAL_BUILD.json` 固定发行模块 SHA-256；`npm run verify` 可离线验收完整性，不需要安装依赖。

## 推荐部署

1. 打开 `https://deploy.imsuk.cn`。
2. 输入 Cloudflare API Token、Account ID、Worker 名称和公开访问域名。
3. 输入从 `https://license.imsuk.cn` 购买后得到的永久 License。
4. 向导会创建 D1、写入 Worker Secrets、上传本仓库锁定版本并切换部署。
5. 部署完成后进入 `/admin` 配置商户、支付通道和插件。

后台“使用文档”已经逐项列出 15 个付费插件的凭据来源、字段填写、Webhook、Docker Watcher 和排错步骤。

License 只显示一次，请立即离线保存。域名已绑定但 License 丢失时请通过 `https://pay.imsuk.eu.org/contact` 联系处理；换域名使用 License 站的“自助换绑”。

## 手动部署

仓库本身不要求 `npm install`。如本机已经具备 Wrangler：

```powershell
wrangler d1 create edgepay-serverless-payment
# 将返回的 database_id 写入 wrangler.toml
wrangler d1 execute DB --remote --file=./schema.sql
wrangler secret put EDGEPAY_LICENSE
wrangler secret put ADMIN_TOKEN
wrangler secret put EPAY_KEY
wrangler secret put SETTINGS_ENCRYPTION_KEY
wrangler deploy
```

再把 `PUBLIC_BASE_URL`、`EPAY_PID`、`ADMIN_USERNAME` 改成自己的值后重新发布。自定义域名在 Cloudflare 控制台维护。

## 免费与付费插件

免费插件会在 License 页面展示为禁止选择并自动包含；付费插件按所购权限启用。增购沿用原 License，换绑成功后签发新域名 License 并同步注销旧 License。

## 完整性校验

```powershell
npm run verify
```

本仓库保留上游 MIT 许可声明。商业插件的使用范围同时受所购永久 License 权限约束。
