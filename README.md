# BoloHi 官网评审项目

独立项目，使用已确认的 Ola v19 结构与交互。品牌资源为用户指定共享盘的真实横版 Logo / icon；首屏及五个功能场景全部占位，未生成宣传图或视频。

## 构建和预览

需要 Python 3 + Pillow、Node 及 Chrome（仅 QA）。

2026-11-17 用户最新确认：所有标题、功能介绍、FAQ、表单、弹层、页脚及语言翻译完全复用 Ola v19；仅变更品牌标识、产品名、配色、装饰、地址和主体联系方式。正式法律协议仍使用 BoloHi 官方正文。此确认取代早期按真实产品能力改写营销文案的要求。

```powershell
python -m pip install Pillow
python build-aligned.py
node --check check-script.js
python -m http.server 8137 --directory dist
```

访问 http://localhost:8137/?lang=zh 。`dist/index.html` 也可直接离线打开。四种语言：en / zh / hi / id。

- `brand-config.json`：名称、主体、地址、链接、品牌颜色、标识来源。
- `product-copy.json`：2026-11-17 确认版全部四语展示文案；完整复用 Ola v19，仅替换产品名及事实信息。
- `alignment-slots.js`：固定文字预留槽和场景导航宽度。
- `build-aligned.py`：读取冻结母版、产品配置和官方协议后构建；无其他项目绝对路径依赖。
- `baseline/`：只读结构基线（历史品牌在此是设计对照，不会发布为网站页面）。
- `sources/`：抓取的官方证据和协议快照，包含官方历史字样；不作为新版营销内容。
- `dist/`：仅网站所需的品牌标识、下载徽章、字体、装饰、占位和页面。
- `qa.cjs` / `qa-report.json` / `screenshots/`：自动验证及截图。

变更布局须先确认；本版只替换文案、颜色和不占空间的装饰。所有既有路由、功能场景 ID、data-action、data-channel、data-slide 与下载渠道顺序保留。未知链接给出待确认提示。

## 离线交付

`python package-offline.py` 生成 `delivery/BoloHi-offline.html` 和 `delivery/BoloHi-review-offline.zip`。单文件内嵌资源，可直接双击打开，不依赖外部字体或截图。

## 功能边界

Google Play 已核验。Apple、APK、其他商店和网页充值地址待确认。联系表单仅本地校验，不发送消息。Cookie 偏好只存浏览器；未接统计或广告。社区规则、反霸凌、Cookie 正式政策、执法流程沿用既有页面待确认状态。

详见 [来源与待确认项](SOURCES-AND-HANDOFF.md)、[部署信息](DEPLOYMENT.md)。
