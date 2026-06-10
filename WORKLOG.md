# 萧和和个人网站 · 工作日志

> 最后更新：2026-06-10
> 设计师：Claude (huashu-design + ui-ux-pro-max)
> 状态：已部署 / 可维护

---

## 项目概览

个人品牌网站，承载身份展示、文章作品、社群宣传、动漫追番、背景音乐五大功能。设计语言为「云层虹彩色调 + 明日方舟式空间化主控台 UI」。

- **技术栈**：纯静态 HTML/CSS/JS（单文件 `index.html`）
- **部署方式**：GitHub Pages（`https://xiao-he-he.github.io`）
- **外部依赖**：Google Fonts（Noto Serif SC / Noto Sans SC / JetBrains Mono）、Bangumi API

---

## 文件结构

```
个人网站/
├── index.html              ← 主页面（单文件，包含全部 CSS/JS）
├── update.js               ← 一键更新脚本（追番 + 音乐）
├── fetch_bangumi.js        ← Bangumi API 数据获取
├── data/
│   └── bangumi.json        ← Bangumi 原始数据（JSON）
├── music/                  ← 背景音乐（MP3, 320kbps）
│   └── *.mp3
├── 头像.jpg                ← 个人头像
├── 色调.jpg                ← 参考色调（已内化到 CSS 变量）
├── 明日方舟/               ← 设计参考文档
└── articles/               ← 文章页面（已弃用，改用飞书链接）
```

---

## 设计系统速查

### 色彩

```css
--sky: #86B6D8;        /* 主背景天蓝 */
--pearl: #F7F8FB;      /* 面板珍珠白 */
--sun-cream: #FAEBB1;  /* 光源/CTA 奶油黄 */
--peach: #E7C0C1;     /* 蜜桃粉点缀 */
--aqua-glint: #9EEAD8; /* 淡青虹彩 */
--ink: #1C2340;        /* 正文墨蓝黑 */
--shadow-blue: #495A80;/* 标签/UI 文字 */
--cloud-line: #929AB5; /* 边框/装饰线 */
```

### 字体

| 用途 | 字体 | CSS 变量 |
|------|------|----------|
| 中文标题 | Noto Serif SC | `--font-display` |
| 中文正文 | Noto Sans SC | `--font-body` |
| UI 标签/数据 | JetBrains Mono | `--font-mono` |

### CSS 变量速查

所有视觉参数集中在 `:root` 中（`index.html` 第 14-28 行）。修改颜色/字号/间距从这里改。

---

## 日常维护操作

### 添加新文章

1. 将文章发布到飞书，获取分享链接
2. 在 `index.html` 中找到 `<!-- ═══════════ ARTICLES` 区域
3. 在 `<div class="articles-grid">` 内添加新的 `<article class="article-case">`，参考已有三篇的格式：
   ```html
   <article class="article-case">
     <span class="article-case-num">IV</span>
     <div class="article-case-id">案例 04 / 分类 / 子分类</div>
     <h3>文章标题</h3>
     <p>简短描述，1-2 句话。</p>
     <div class="article-case-meta">
       <span>类型 / 论文</span><span>领域 / XXX</span><span>状态 / 已公开</span>
     </div>
     <a href="飞书链接" target="_blank" rel="noopener" class="article-case-link">查阅文档 →</a>
   </article>
   ```
4. 如果文章数量变成 4 篇，将 `.articles-grid` 改为三列布局：`grid-template-columns: 1fr 1fr 1fr;`

### 更新追番数据

```bash
node update.js
```

或单独运行：

```bash
node fetch_bangumi.js
```

两个命令都会自动更新 `index.html` 中的内嵌数据。

### 添加新音乐

1. 将 MP3 文件放入 `music/` 文件夹
2. 命名格式：`曲名 - 艺术家.mp3`
3. 运行 `node update.js`
4. 脚本会自动扫描 `music/` 并更新播放列表

### 修改配色

编辑 `index.html` 第 14-28 行的 `:root` 块中的 CSS 变量。

### 修改个人信息

在 `index.html` 中搜索「萧和和」或「中国传媒大学」定位到相关文本区域直接编辑。

---

## 部署说明

### GitHub Pages（推荐）

1. 在 GitHub 创建仓库 `xiao-he-he.github.io`（或 `<用户名>.github.io`）
2. 将所有文件推送到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial deploy"
   git remote add origin https://github.com/xiao-he-he/xiao-he-he.github.io.git
   git push -u origin main
   ```
3. 在仓库 Settings → Pages 中启用 GitHub Pages（Source: `main` branch）
4. 网站将在 `https://xiao-he-he.github.io` 上线

### 自动更新（GitHub Actions）

创建 `.github/workflows/update.yml`：
```yaml
name: Auto Update
on:
  schedule:
    - cron: '0 0 * * *'  # 每天运行
  workflow_dispatch:       # 允许手动触发
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install https-proxy-agent
      - run: node update.js --cron
      - run: |
          git config user.name "Bot"
          git config user.email "bot@xiaohehe.dev"
          git add -A
          git diff --staged --quiet || (git commit -m "Auto update: Bangumi + Music" && git push)
```

---

## 给新对话的衔接提示

> 复制以下内容到新对话开头，即可无缝继续工作：

---

### 衔接提示词

我正在维护萧和和的个人网站，项目位于 `E:\下载\个人网站\`。

**项目概要**：
- 网站是一个单文件纯静态 HTML（`index.html`），设计风格为「云层虹彩色调 + 明日方舟式空间化主控台 UI」
- 已部署到 GitHub Pages：`https://xiao-he-he.github.io`
- 设计文档在 `明日方舟/` 文件夹中，工作日志在 `WORKLOG.md`

**当前任务**：[在此描述你要做的事情，例如：添加新文章、修改配色、增加新功能]

**关键文件**：
- `index.html` — 主页面（CSS 变量在 `:root` 块，JS 在底部 `<script>` 标签）
- `update.js` — 一键更新脚本
- `fetch_bangumi.js` — Bangumi 数据获取
- `data/bangumi.json` — 追番原始数据
- `music/` — 背景音乐文件夹
- `WORKLOG.md` — 完整工作日志

**设计约束**（请严格遵守）：
1. 色彩体系使用云层虹彩色调（天蓝 #86B6D8、珍珠白 #F7F8FB、奶油黄 #FAEBB1、墨蓝黑 #1C2340），不要引入暗黑风格或高饱和霓虹
2. 中文作为信息主元素，英文作为副元素（mono 小标签）
3. 保持切角面板、L 形角标、细线网格、噪点纹理等明日方舟式 UI 特征
4. 保持三层景深（背景 → 中景 → 前景面板）
5. 禁止大圆角、渐变泡泡、emoji 图标、AI 生成 SVG 插画
6. 桌面端优先（max-width: 1320px）
7. 所有改动保持在 `index.html` 单文件中，不引入框架

**文章链接**（飞书）：
- 假如关卡会说话：`https://jcnm5t087km2.feishu.cn/wiki/Sn15w3rkCikYA8kS6BwcmH0Xn1f`
- 设计题积累：`https://jcnm5t087km2.feishu.cn/wiki/XQd7wdnxBiFhw6keJ0EcIonDntb`
- 游戏开发入门：`https://jcnm5t087km2.feishu.cn/wiki/GTObwqw2YitX6okkijGcn1wgnDi`

---

## 已完成工作记录

### 2026-06-10
- [x] 从色调.jpg 提取云层虹彩色调体系
- [x] 从四个设计文档学习明日方舟平面设计语言
- [x] 实现空间化档案主控台 UI（切角面板、巨型圆环、等距平台、漂浮模块）
- [x] 中文主导 + 英文 mono 副元素的全站文案
- [x] Bangumi 追番数据内嵌（13 条，自动选中有数据的标签）
- [x] 音乐播放器迁移为底部 HUD（10 首 MP3）
- [x] 三篇文章改为飞书外链
- [x] 触星项目改为等距星图沙盘
- [x] base 字号从 16px 提升到 20px，加深墨水色
- [x] 创建 `update.js` 一键更新脚本
- [x] 创建 GitHub Actions 自动更新方案
- [x] 创建 `WORKLOG.md` 工作日志

### 待办
- [ ] 部署到 GitHub Pages
- [ ] 启用 GitHub Actions 自动更新
- [ ] 后续文章添加到网站
- [ ] 音乐文件补充（当前 10 首，原有 15 首中 5 首缺失）
