/* ============================================================
   《我们的乐章》 OUR MELODY —— 成员数据（默认名单）
   ------------------------------------------------------------
   数据来源：第六组"成员信息收集"飞书多维表格（2026-10-10 抓取），
   25 位成员 = 每个人一枚音符。
   - name    昵称（括号里的组内角色挪到了 role）
   - role    组内角色（小组长/技术/创意/机动/氛围…）
   - quote   1-2 句人物刻画（个人卡片引言）
   - trait   代表物 + 为什么是它（卡片彩蛋）
   - section 声部（0 低音 / 1 中音 / 2 高音，表格里没有分组，按轮转均分）
   - pitch/timbre 音高与音色（按声部音区与预设自动配给）
   想换名单：直接改本文件，或运行后在页面右上角「⬆ 名单」上传表格。
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
  {
    name: '霍斯', role: '小组长', section: 0, pitch: 'C3',
    timbre: { wave: 'triangle', cutoff: 1300, vol: 0.9 },
    quote: '在游戏行业摸爬滚打中形成自己的工作流，努力成为可身兼多职的全能开发者',
    trait: '代表物是「赤狐、游戏程序」——Foxy the Fox 霍斯这昵称取自赤狐 本职是游戏开发中的游戏程序岗嘛',
  },
  {
    name: 'Bye~',
    img: 'img/m02.jpg', role: '技术担当', section: 1, pitch: 'C4',
    timbre: { wave: 'sine', cutoff: 2100, vol: 0.85 },
    quote: '我是个J人，但是限定在ddl前以及旅行中，喜欢知道各种有趣的新知识',
    trait: '代表物是「葡萄柚」——7分酸3分甜',
  },
  {
    name: '董明洁', role: '摄影爱好者', section: 2, pitch: 'C5',
    timbre: { wave: 'triangle', cutoff: 2200, vol: 0.85 },
    quote: '她认真规划混乱无序的任务，忙里偷闲用镜头记录生活的小美好，用爱好滋养和治愈混乱焦虑的大四学期。',
    trait: '代表物是「照相机📷」——因为我喜欢用镜头记录生活中的一些瞬间',
  },
  {
    name: 'Manty',
    img: 'img/m04.jpg', role: '创意担当', section: 0, pitch: 'D3',
    timbre: { wave: 'sine', cutoff: 1100, vol: 0.92 },
    quote: '她在无数条人生道路中寻寻觅觅，正从学生时代的迷茫飞向实践经验积累的探索阶段',
    trait: '代表物是「信天翁」——信天翁一生中的绝大多数时间在海洋上空飞行，如人忙碌一生去寻找真正要去的地方',
  },
  {
    name: '小杨',
    img: 'img/m05.jpg', role: '机动支援', section: 1, pitch: 'D4',
    timbre: { wave: 'sawtooth', cutoff: 1400, vol: 0.6 },
    quote: '她用真诚耐心去回应外界，她正处于人生抉择的重要阶段',
    trait: '代表物是「葡萄柚」——葡萄柚长得像柚子，个头像葡萄一样大，切开来又像芒果，吃起来又有百香果的香味，口感像橙子。多元融合代表了我喜欢接触新事物的性格……',
  },
  {
    name: '周静', role: '氛围担当', section: 2, pitch: 'D5',
    timbre: { wave: 'triangle', cutoff: 1500, vol: 0.9 },
    quote: '她把长跑的 耐力与步调揉进跨专业的转型里，从工科赛道稳步转场，正朝着自己向往的教育方向踏实前行 。',
    trait: '代表物是「藏青色表带的运动手环」——表带磨出了细微的使用痕迹，记录过两千多公里的跑量，也陪我熬过无数个备考刷题的深夜，每一下震动的节奏里，藏着我 “慢慢来也能到……',
  },
  {
    name: '小绿恐龙',
    img: 'img/m07.jpg', role: '研究生', section: 0, pitch: 'E3',
    timbre: { wave: 'square', cutoff: 1000, vol: 0.5 },
    quote: '虽然有些工作比较难，需要耗费大量时间精力，但也享受探索的过程',
    trait: '代表物是「长明灯」——即使有时会有灰尘，但也总是亮着的',
  },
  {
    name: '皮蛋',
    img: 'img/m08.jpg', role: '技术担当', section: 1, pitch: 'E4',
    timbre: { wave: 'sine', cutoff: 3000, vol: 0.8 },
    quote: '他把游戏里探索未知的兴致，延伸至山野与晨昏之间，以镜头收藏光影、定格风景，在大学生活里走出一条属干自己的取景之路。',
    trait: '代表物是「摄像机」——相比奔赴远方的盛景，留下眼前的风景，或许更值得一点。',
  },
  {
    name: '潘偲毓',
    img: 'img/m09.jpg', role: '待熟识的伙伴', section: 2, pitch: 'E5',
    timbre: { wave: 'triangle', cutoff: 2700, vol: 0.8 },
    quote: '她爱好广泛、内心细腻，喜欢探索不同的可能性，也喜欢从不同角度理解事物的不同面向。',
    trait: '代表物是「帆船」——帆船在水面乘风行进，不像大船那样有着极其明确单一的航向，符合本人对于勇气与探索欲的向往。',
  },
  {
    name: '林韶颖',
    img: 'img/m10.jpg', role: '待熟识的伙伴', section: 0, pitch: 'G3',
    timbre: { wave: 'triangle', cutoff: 1300, vol: 0.9 },
    quote: '我正在从一个纯正到不能再纯正的文科生慢慢接触 AI 编程等，也在焦虑自己未来的发展',
    trait: '代表物是「小羊」——不喜欢争抢而且来自内蒙',
  },
  {
    name: '赵诗婷',
    img: 'img/m11.jpg', role: '机动支援', section: 1, pitch: 'G4',
    timbre: { wave: 'sine', cutoff: 2100, vol: 0.85 },
    quote: '她把物理的严谨与义教的创意融汇为对教学与科研的耐心探索，正从重拾阅读的习惯中沉淀自我，以安静持续的姿态笃定前行。',
    trait: '代表物是「萤火虫」——萤火虫微光而持续，像她按自己的节奏安静发光，在理性与感性之间找到平衡。',
  },
  {
    name: 'logic',
    img: 'img/m12.jpg', role: '机动支援', section: 2, pitch: 'G5',
    timbre: { wave: 'triangle', cutoff: 2200, vol: 0.85 },
    quote: '她把四年青春折进一只行囊，站在毕业的站台上，身后是熄了灯的教室与通宵的夜，身前是还没写着答案的远方，列车未到，心已启程',
    trait: '代表物是「棉花糖」——她就像一个行走的棉花糖，浑身都散发着一种软乎乎、甜滋滋的暖意，让人忍不住想靠近',
  },
  {
    name: '马心玉 阿斯蒂',
    img: 'img/m13.jpg', role: '二次元', section: 0, pitch: 'A3',
    timbre: { wave: 'sine', cutoff: 1100, vol: 0.92 },
    quote: '她不想把人生方向一下子定死，于是先去把 AI 接进日常，看看自己还能长出什么。',
    trait: '代表物是「橘子汽水」——橘子把夏天藏进汽水，晃一晃才冒出来',
  },
  {
    name: '四五天',
    img: 'img/m14.jpg', role: '氛围担当', section: 1, pitch: 'A4',
    timbre: { wave: 'sawtooth', cutoff: 1400, vol: 0.6 },
    quote: '她站在人生重要的节点，只是自己一个人闷在自己的世界里面，每天画画，做一些少量的工作，不知道船会驶向何处',
    trait: '代表物是「耳机」——有自己的世界',
  },
  {
    name: '青晏',
    img: 'img/m15.jpg', role: '技术担当', section: 2, pitch: 'A5',
    timbre: { wave: 'triangle', cutoff: 1500, vol: 0.9 },
    quote: '他将各类材料与 PPT 汇总整理为答辩素材，目前正从演习阶段过渡至正式的竞赛答辩现场。',
    trait: '代表物是「企鹅」——沉默不是高冷，是能量有限，企鹅是世界上最安静的鸟',
  },
  {
    name: '周倩红',
    img: 'img/m16.jpg', role: '安静随性', section: 0, pitch: 'C3',
    timbre: { wave: 'square', cutoff: 1000, vol: 0.5 },
    quote: '在一次次实践打磨中沉淀想法，正从细碎的体验里，慢慢塑造属于自己的表达。',
    trait: '代表物是「鹅卵石」——鹅卵石经流水打磨，外表温润，内里坚定，像我待人柔和，保有自己的价值准则。',
  },
  {
    name: '书朗',
    img: 'img/m17.jpg', role: '共创官', section: 1, pitch: 'C4',
    timbre: { wave: 'sine', cutoff: 3000, vol: 0.8 },
    quote: '她始终对他人及各类想法抱有好奇心，以温和的方式联结团队同伴，在推进科研工作的同时，与团队共同在 AI 项目中探索未来的全新可能性。',
    trait: '代表物是「探照灯」——小时候回家走夜路，黑茫茫一片，多么希望有盏灯可以照亮前路，好在头顶的夜空隐约有星星点点的光亮。二十多岁对未来的迷茫似乎也是一……',
  },
  {
    name: '小Q',
    img: 'img/m18.jpg', role: '技术担当', section: 2, pitch: 'C5',
    timbre: { wave: 'triangle', cutoff: 2700, vol: 0.8 },
    quote: '对待一切都开怀大笑是我的人生底色',
    trait: '代表物是「草莓熊」——他是玫粉色的哈哈哈哈',
  },
  {
    name: '2ZH',
    img: 'img/m19.jpg', role: '创意担当', section: 0, pitch: 'D3',
    timbre: { wave: 'triangle', cutoff: 1300, vol: 0.9 },
    quote: '她把视觉传达设计、动态影像创作、揽星斋LANCIE晶石文创的审美表达，连同多项备考的持续蓄力，层层积蓄成属于自己的内核。',
    trait: '代表物是「泡芙」——泡芙外壳坚韧有型，内里藏着柔软丰盈',
  },
  {
    name: '鱼子酱',
    img: 'img/m20.jpg', role: '小组长', section: 1, pitch: 'D4',
    timbre: { wave: 'sine', cutoff: 2100, vol: 0.85 },
    quote: '每天都在东奔西走的学习新事物中，日子过得满满的好幸福的吧',
    trait: '代表物是「宇航员」——名字中带宇字，小时候身边人常给我起外号叫宇航员。现在虽然还没有飞到外太空，但是正在不断感受这个世界，窝要肘遍全天下!',
  },
  {
    name: 'zz',
    img: 'img/m21.jpg', role: '机动支援', section: 2, pitch: 'D5',
    timbre: { wave: 'triangle', cutoff: 2200, vol: 0.85 },
    quote: '她在未知与混沌中探索尝试，平淡生活',
    trait: '代表物是「剑兰」',
  },
  {
    name: '小玉',
    img: 'img/m22.jpg', role: '汇报担当', section: 0, pitch: 'E3',
    timbre: { wave: 'sine', cutoff: 1100, vol: 0.92 },
    quote: '我最近忙着部门招新后的培养，考英语导游证和学也任务，抽空去旅游和徒步',
    trait: '代表物是「玉米」——喜欢玉米，并且最近生活和玉米一样排列的很紧密，喜欢甜甜的生活',
  },
  {
    name: '潘盈颖-ppppy',
    img: 'img/m23.jpg', role: '氛围担当', section: 1, pitch: 'E4',
    timbre: { wave: 'sawtooth', cutoff: 1400, vol: 0.6 },
    quote: '她是一个有明确目标和规划的人，但是缺少一定执行力，但她相信自己一定能行。',
    trait: '代表物是「宠物 音乐」——宠物是我生命不可或缺的一部分',
  },
  {
    name: '瑜',
    img: 'img/m24.jpg', role: '技术担当', section: 2, pitch: 'E5',
    timbre: { wave: 'triangle', cutoff: 1500, vol: 0.9 },
    quote: '她把阅读沉淀的思考与捕捉细微的感知汇成成长底气，正从象牙塔的安稳驶向不可测的新阶段。',
    trait: '代表物是「猫头鹰」——猫头鹰沉静而敏锐，像她对周遭情绪与细节的洞察。',
  },
  {
    name: '大坤儿',
    img: 'img/m25.jpg', role: '创意担当', section: 0, pitch: 'G3',
    timbre: { wave: 'square', cutoff: 1000, vol: 0.5 },
    quote: 'Ta站在人群之中，感受\"场\"的流动，被它充满，再去撞见那些藏在\"人\"里的魅力。',
    trait: '代表物是「底片」——拍下时什么都看不见，进暗房洗过才显影',
  }
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
