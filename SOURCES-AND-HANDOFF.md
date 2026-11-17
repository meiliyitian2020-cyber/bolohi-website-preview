# 官方来源与交接记录

来源首次核验：2026-11-13（Asia/Shanghai）；文案方向更新：2026-11-17。

**最新确认优先**：用户于 2026-11-17 明确要求所有展示文案、标题复用 Ola v19，包括直播、PK 等原文。当前 product-copy.json 已完整同步四语母版，只替换产品名称与事实信息，不再使用此前编写的 BoloHi 专属营销文案。功能场景与导航名称恢复母版原样；该展示决定由用户确认，不作为重新核验产品能力的证明。正式法律协议和真实业务目的链接仍来自 BoloHi。

## 身份和可复用内容

1. https://bolohi.net/ 返回 200，当前最终 URL 相同。标题 Bolohi；About Us 使用 BoloHi，Logo 与 Google Play 同为 BoloHi，故展示名确定为 **BoloHi**（飞书 BOLO 为产品列简称）。
2. 官网当前主脚本：https://bolohi.net/assets/index.f778a047.js 。快照 `sources/official.html`、`official.js`。原首页 slogan 为 “Party,Voice Chat and making friends”，功能为 Free Games、Voice Chat room，About 描述新加坡技术公司和社交愿景。
3. 官网直接链接 https://play.google.com/store/apps/details?id=com.live.hey 。当前应用名 BoloHi，开发者展示 BoloHi Team，开发者主体 RAMBOJOY TECHNOLOGY PTE. LTD.；App support 官网回指 bolohi.net，包名 com.live.hey。商店快照 `sources/store.html`。
4. 商店描述支持语音房、游戏、虚拟礼物、官方主题房和 3D Virtual Space，初版据此编写专属五场景文案；2026-11-17 最新确认已改为完整复用 Ola v19 的五场景标题与描述，原槽位 ID voice/live/pk/games/creator 保留。没有宣称用户规模、评价、支付能力或保障承诺。
5. 官方 About 与母版所述成立背景相同，保留精简翻译；2026-11-17 起 values 与所有其他展示文案也按母版复用。

## 主体事实与差异

- 官网主体：Rambojoy Technology Pte. Ltd.；Google Play：RAMBOJOY TECHNOLOGY PTE. LTD.（大小写差异）。
- 官网地址：30 PASIR PANJANG ROAD #15-31A, MAPLETREE BUSINESS CITY, Singapore；商店补充邮编 117440。本版联系身份沿用官网原文，不自动拼接修改。
- 官网客服/商店介绍邮箱：bolohiservice@gmail.com；Google Play App support / developer 邮箱：majunwen002@gmail.com。页面采用官网客服邮箱；两者归属和职责待业务确认，不隐藏差异。
- 儿童政策公开报告邮箱：bolochildrenreport@gmail.com（仅在正式政策中保留）。
- 商店年龄标签 Mature 17+；儿童政策正文要求至少 18 岁或当地等效年龄。两项不擅自统一，待法务核对。
- 官网页脚年份 2017–2023 为旧站信息；评审页使用当前年份 2026，不代表成立年份。

## 正式协议

均从官网正式链接及其调用的官方接口取得，未拿其他产品的正文换名：

- 用户协议：https://www.bolohi.net/a/license/bolohi-user.html?lang=en
- 隐私政策：https://www.bolohi.net/a/license/bolohi-privacy.html?lang=en
- 儿童安全：https://www.bolohi.net/a/license/children-policy.html

对应页面脚本声明 appName=bolohi，postType=user/privacy；children-policy 页面 os=web。内容接口为 https://feapi.bolohi.net/post-platform/getPostDetail?lang=en，请求头 x-app-name=bolohi、x-app-post-type 对应类型、x-app-os=android/web。快照 `sources/*-policy.json`，只移除脚本及事件属性，原文保留在原有政策路由内，始终提供正式链接。

**官方原文差异**：用户协议在定义 App 的一句中仍写 “Ola Party mobile application”，其他名称及网站为 BoloHi。此为 2026-11-13 官方公开协议自身的遗留字样，保留原文并提交法务核实；不是新站误用 Ola 协议。隐私政策日期 27/08/2025；儿童政策 December, 2024。完整英文原文保留，页面框架提供四语。

## 待确认 / 未接通

- Apple、APK、Xiaomi、OPPO、vivo、HUAWEI 真实目标 URL 未确认。官网 APK 由远端全局配置注入，当前未取得可独立核验的静态 URL；未猜测链接。
- 网页充值 URL、支付后台未提供。原位入口明确反馈未接通；没有打开其他品牌或假支付页面。
- 联系表单无后台，仅本地校验和预览成功提示；支持邮箱可通过 mailto 使用。
- 没有生产统计上报、埋点接收端或广告；data-* 事件标记原样保留。Cookie 选择仅保存偏好。
- 社区规则、反霸凌、Cookie 正式政策与执法请求流程需业务/法务提供；母版原有待确认页面保留，不对外宣称正式制度。
- 飞书链接 https://lp3jrqympq.feishu.cn/wiki/X4Czwro8ci1QBikh3uRccNDMnsb?sheet=ymlzGV 在当前工具返回不可访问，无法核对“官网缺失项”工作表全部行。本版按用户指定入口完成覆盖；后续需可读表格核对额外条目。
- 首屏 16:9/9:16 和五个 720×1280 资源均占位；替换文件在 `dist/assets/placeholder-*`，构建生成规则集中在 build-aligned.py。关于我们插画也使用占位。

## 标识

来自用户指定的只读共享盘：`BoloHi Logo/源文件/透明底/使用规范-横版-黑字.png` 和白字版本；App icon 为 `icon/play/ic_launcher_APP.webp`。黑字版用于浅色表面，白字版保存在品牌目录供后续深色表面。原始横版 610×234，等比完整显示；未重新绘制。Favicon 由真实 icon 缩小。

## 母版与隔离

指定提交 f8026d91802eb907a54d9f84c349aa306ef098cd，核对本地最新提交相符。构建断言所有 style 中除颜色外文本完全相同，保持盒尺寸、比例、断点。`alignment-reference.json` 保存源 SHA256 和槽位。没有写入 Ola / Infriends 目录、共享盘、既有仓库或站点。

补充协议差异：官方用户协议还包含 `https://www.olaparty.com/a/security-explanation/index.html` 安全说明链接。本版作为官方协议引用保留该链接原文，没有将其当成本产品下载、充值或业务跳转；须由法务/官方维护者核对替换。隐私协议还引用 ihago.net 的 PDF 和 duowan.com 崩溃服务说明，均为官方原文引用。

布局测量说明：脚本中的 ALIGN_REFERENCE 和 ALIGN_IDENTITY 为冻结母版的隐藏测量参考，不会作为品牌页面文字或联系信息展示。真实公司名称和地址长度与母版不同，允许其自然文本宽度不同；文字占用高度和相邻控件位置按母版预留。
