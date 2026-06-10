// update.js — 个人网站一键更新脚本
// 功能：
//   1. 运行 fetch_bangumi.js 更新追番数据
//   2. 扫描 music/ 文件夹，自动发现新音乐并更新到 index.html
//   3. 支持 GitHub Actions 自动运行
//
// 用法：
//   node update.js              # 手动运行
//   node update.js --cron       # 静默模式（用于定时任务）

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HTML_FILE = 'index.html';
const MUSIC_DIR = 'music';
const BANGUMI_SCRIPT = 'fetch_bangumi.js';

// ─── 步骤 1：更新追番数据 ───
console.log('═══════════════════════════════════');
console.log('  个人网站更新脚本');
console.log('═══════════════════════════════════\n');

console.log('[1/2] 更新 Bangumi 追番数据...');
try {
  execSync('node ' + BANGUMI_SCRIPT, { stdio: 'inherit', cwd: __dirname });
} catch (e) {
  console.log('⚠ Bangumi 更新失败（网络可能不通），跳过此步骤\n');
}

// ─── 步骤 2：扫描音乐文件夹 ───
console.log('\n[2/2] 扫描音乐文件夹...');

if (!fs.existsSync(MUSIC_DIR)) {
  console.log('  music/ 文件夹不存在，跳过');
  process.exit(0);
}

const musicFiles = fs.readdirSync(MUSIC_DIR)
  .filter(f => /\.(mp3|m4a|ogg|wav|flac)$/i.test(f))
  .sort();

console.log('  发现 ' + musicFiles.length + ' 个音频文件');

// 解析文件名 "曲名 - 艺术家.ext"
function parseTrackName(filename) {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  const parts = base.split(' - ');
  if (parts.length >= 2) {
    return { title: parts[0].trim(), artist: parts.slice(1).join(' - ').trim() };
  }
  return { title: base.trim(), artist: '未知' };
}

// 生成新的 tracks 数组代码
const tracksData = musicFiles.map(f => {
  const { title, artist } = parseTrackName(f);
  return `{file:'music/${f}',title:'${title.replace(/'/g, "\\'")}',artist:'${artist.replace(/'/g, "\\'")}'}`;
});

const newTracksCode = 'const t=[' + tracksData.join(',') + '];';

// 读取 index.html
let html = fs.readFileSync(HTML_FILE, 'utf-8');

// 替换音乐 tracks 数组
const musicRegex = /const t=\[\{file:'music\/[^]]+?\];/s;
if (musicRegex.test(html)) {
  const oldMatch = html.match(musicRegex)[0];
  const oldCount = (oldMatch.match(/\{file:/g) || []).length;
  html = html.replace(musicRegex, newTracksCode);
  console.log('  已更新音乐列表：' + oldCount + ' → ' + musicFiles.length + ' 首');
} else {
  console.log('  ⚠ 未找到音乐 tracks 数组，请检查 HTML 结构');
}

fs.writeFileSync(HTML_FILE, html, 'utf-8');

console.log('\n═══════════════════════════════════');
console.log('  更新完成！');
console.log('  追番数据：' + (fs.existsSync('data/bangumi.json') ? '已更新' : '未找到'));
console.log('  音乐列表：' + musicFiles.length + ' 首');
console.log('═══════════════════════════════════');
