// fetch_bangumi.js
// 从 Bangumi API 获取用户收藏数据，保存为 data/bangumi.json，并自动更新 index.html 内嵌数据
// 用法: node fetch_bangumi.js
// 前提: 你的网络能访问 api.bgm.tv，或已配置代理

const fs = require('fs');
const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');

const USER_ID = 1221444;
const OUTPUT = 'data/bangumi.json';
const HTML_FILE = 'index.html';
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;

function fetch(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'User-Agent': 'XiaoHehe-Website/1.0' }
    };
    if (PROXY) {
      options.agent = new HttpsProxyAgent(PROXY);
      console.log('使用代理: ' + PROXY);
    }
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
        } else {
          reject(new Error('HTTP ' + res.statusCode));
        }
      });
    }).on('error', reject);
  });
}

function updateHTML(data) {
  if (!fs.existsSync(HTML_FILE)) {
    console.log('未找到 ' + HTML_FILE + '，跳过 HTML 更新');
    return;
  }
  const compact = data.map(item => {
    const s = item.subject || {};
    return JSON.stringify({
      subject: {
        images: { common: s.images?.common || '', medium: s.images?.medium || '' },
        name: s.name || '',
        name_cn: s.name_cn || '',
        eps: s.eps || 0
      },
      ep_status: item.ep_status || 0,
      type: item.type,
      rate: item.rate || 0
    });
  }).join(',');
  const inlineData = '[' + compact + ']';

  let html = fs.readFileSync(HTML_FILE, 'utf-8');
  const regex = /const DATA=\[.*?\];/s;
  if (regex.test(html)) {
    html = html.replace(regex, 'const DATA=' + inlineData + ';');
    fs.writeFileSync(HTML_FILE, html, 'utf-8');
    console.log('已更新 ' + HTML_FILE + ' 中的内嵌数据');
  } else {
    console.log('警告：未在 ' + HTML_FILE + ' 中找到 const DATA 数组，无法自动更新');
  }
}

(async () => {
  console.log('正在获取 Bangumi 用户 ' + USER_ID + ' 的收藏数据...\n');

  let allData = [];
  let offset = 0;
  const limit = 50;

  try {
    while (true) {
      const url = 'https://api.bgm.tv/v0/users/' + USER_ID + '/collections?subject_type=2&limit=' + limit + '&offset=' + offset;
      console.log('请求: offset=' + offset);
      const resp = await fetch(url);
      if (!resp.data || resp.data.length === 0) break;
      allData = allData.concat(resp.data);
      offset += limit;
      if (resp.data.length < limit) break;
    }

    console.log('\n获取完成！共 ' + allData.length + ' 条收藏记录');
    console.log('正在写入 ' + OUTPUT + '...');
    fs.writeFileSync(OUTPUT, JSON.stringify(allData, null, 2), 'utf-8');
    console.log('已保存到 ' + OUTPUT);

    console.log('正在更新 ' + HTML_FILE + '...');
    updateHTML(allData);
    console.log('全部完成！刷新浏览器即可看到最新数据');
  } catch (e) {
    console.error('获取失败: ' + e.message);
    console.error('\n可能的原因:');
    console.error('1. 当前网络无法访问 api.bgm.tv（可能需要代理）');
    console.error('2. 用户 ID ' + USER_ID + ' 不存在或设置了隐私保护');
    process.exit(1);
  }
})();
