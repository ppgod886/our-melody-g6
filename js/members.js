/* ============================================================
   《我们的乐章》 OUR MELODY —— 成员数据（默认名单）
   ------------------------------------------------------------
   - 这份是"默认名单"。换名单有两种方式：
     1. 直接改本文件的 MEMBERS_DEFAULT；
     2. 不改代码：网站右上角「⬆ 名单」上传 CSV/JSON/Excel 表格
        （名单会保存在浏览器里，随时可恢复默认）。
   - MEMBERS 字段：
       name 姓名 / role 职责 / quote 一句话简介 / trait 个人特色
       section 声部（0 低音 / 1 中音 / 2 高音）
       pitch 音高 / timbre 音色（wave 波形 / cutoff 亮度 / vol 音量）
   ============================================================ */

const SECTIONS_DEFAULT = [
  {
    name: '低音声部 · 根音组',
    en: 'ROOT SECTION',
    desc: '统筹与落地 —— 先把地基稳稳铺好的人',
  },
  {
    name: '中音声部 · 主旋律组',
    en: 'MELODY SECTION',
    desc: '创意与设计 —— 曲子从这里开始好听',
  },
  {
    name: '高音声部 · 灵光组',
    en: 'LIGHT SECTION',
    desc: '技术与实现 —— 把每一个想法变成声音',
  },
];

const MEMBERS_DEFAULT = [
  /* ---------- 低音声部 · 根音组（统筹与落地） ---------- */
  {
    name: '陈屿', role: '组长 · 总统筹', section: 0, pitch: 'C3',
    timbre: { wave: 'triangle', cutoff: 1300, vol: 0.95 },
    quote: '把复杂的事情，变得简单一点。',
    trait: '口头禅："先定 deadline，再谈梦想。"',
  },
  {
    name: '阿树', role: '进度 · 时间轴管理', section: 0, pitch: 'D3',
    timbre: { wave: 'sine', cutoff: 1100, vol: 0.95 },
    quote: '慢一点，也没关系，但不能停。',
    trait: '表格控，能给睡觉排一张甘特图。',
  },
  {
    name: '小满', role: '物料 · 后勤补给', section: 0, pitch: 'E3',
    timbre: { wave: 'triangle', cutoff: 1500, vol: 0.9 },
    quote: '包里永远多出一根数据线。',
    trait: '团队百宝箱——你需要什么，她都有。',
  },
  {
    name: '周野', role: '记录 · 会议纪要', section: 0, pitch: 'G3',
    timbre: { wave: 'sine', cutoff: 1050, vol: 0.9 },
    quote: '好记性，不如烂笔头。',
    trait: '写的会议纪要，比小说还好看。',
  },
  {
    name: '拾一', role: '联络 · 对外对接', section: 0, pitch: 'A3',
    timbre: { wave: 'triangle', cutoff: 1250, vol: 0.9 },
    quote: '所有人的时区，我都对过。',
    trait: '社交枢纽：群里 @ 谁都秒回。',
  },

  /* ---------- 中音声部 · 主旋律组（创意与设计） ---------- */
  {
    name: '林晚', role: '视觉 · 主视觉设计', section: 1, pitch: 'C4',
    timbre: { wave: 'triangle', cutoff: 2000, vol: 0.85 },
    quote: '美，是秩序的另一种名字。',
    trait: '色卡成瘾——看晚霞会自动取色。',
  },
  {
    name: '南枝', role: '插画 · 动效设计', section: 1, pitch: 'D4',
    timbre: { wave: 'sine', cutoff: 1800, vol: 0.85 },
    quote: '我喜欢把灵感藏在日常里。',
    trait: '速写本不离手，猫是固定模特。',
  },
  {
    name: '苏叶', role: '文案 · 叙事策划', section: 1, pitch: 'E4',
    timbre: { wave: 'triangle', cutoff: 2200, vol: 0.85 },
    quote: '字是有温度的。',
    trait: '删稿狂魔：一句话能改十八遍。',
  },
  {
    name: '江离', role: '排版 · 版式设计', section: 1, pitch: 'G4',
    timbre: { wave: 'sawtooth', cutoff: 1400, vol: 0.6 },
    quote: '留白，也是一句话。',
    trait: '对齐强迫症：差 0.5px 都要较真。',
  },
  {
    name: '顾星迟', role: '摄影 · 素材采集', section: 1, pitch: 'A4',
    timbre: { wave: 'sine', cutoff: 2100, vol: 0.85 },
    quote: '光线路过的时候，我恰好在场。',
    trait: '相机比手机像素高，也比手机重。',
  },

  /* ---------- 高音声部 · 灵光组（技术与实现） ---------- */
  {
    name: '何声', role: '前端 · 页面开发', section: 2, pitch: 'C5',
    timbre: { wave: 'square', cutoff: 1000, vol: 0.5 },
    quote: '保持好奇，保持手热。',
    trait: '能把 bug 悄悄调成彩蛋的人。',
  },
  {
    name: '柯律', role: '交互 · 动效工程', section: 2, pitch: 'D5',
    timbre: { wave: 'triangle', cutoff: 2400, vol: 0.8 },
    quote: '好的交互，是界面替你说话。',
    trait: '手指自带缓动函数。',
  },
  {
    name: '白露', role: '音频 · 声音设计', section: 2, pitch: 'E5',
    timbre: { wave: 'sine', cutoff: 3000, vol: 0.8 },
    quote: '耳朵，是用来听心的。',
    trait: '走路都在踩节拍。',
  },
  {
    name: '程一', role: '测试 · 质量把关', section: 2, pitch: 'G5',
    timbre: { wave: 'triangle', cutoff: 2700, vol: 0.8 },
    quote: '我专挑大家觉得"没问题"的地方。',
    trait: '灾难预言家：说会坏，必坏。',
  },
  {
    name: '阿澈', role: '发布 · 部署运维', section: 2, pitch: 'A5',
    timbre: { wave: 'sawtooth', cutoff: 1600, vol: 0.55 },
    quote: '上线那一刻，最安静，也最响。',
    trait: '深夜部署侠：服务器睡了他还没睡。',
  },
];

/* 供"上传名单"自动配给音高与音色的素材池 */
const PITCH_POOLS = [
  ['C3', 'D3', 'E3', 'G3', 'A3'],
  ['C4', 'D4', 'E4', 'G4', 'A4'],
  ['C5', 'D5', 'E5', 'G5', 'A5'],
];
const TIMBRE_PRESETS = [
  { wave: 'triangle', cutoff: 1300, vol: 0.9 },
  { wave: 'sine',     cutoff: 2100, vol: 0.85 },
  { wave: 'triangle', cutoff: 2200, vol: 0.85 },
  { wave: 'sine',     cutoff: 1100, vol: 0.92 },
  { wave: 'sawtooth', cutoff: 1400, vol: 0.6 },
  { wave: 'triangle', cutoff: 1500, vol: 0.9 },
  { wave: 'square',   cutoff: 1000, vol: 0.5 },
  { wave: 'sine',     cutoff: 3000, vol: 0.8 },
  { wave: 'triangle', cutoff: 2700, vol: 0.8 },
];

/* 当前生效的名单（启动时可能被"上传名单"覆盖） */
let SECTIONS = SECTIONS_DEFAULT.map(s => ({ ...s }));
let MEMBERS = MEMBERS_DEFAULT.map(m => ({ ...m }));
