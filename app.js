const STORAGE_KEY = "touched-mvp-state-v1";
const BACKUP_KEY = "touched-mvp-state-v1-backup";
const SESSION_KEY = "touched-mvp-current-user";
const app = document.querySelector("#app");
const toastRoot = document.querySelector("#toast-root");

const MBTI = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const profileChoices = {
  status: ["在校学生", "homeschool", "gap中", "求职中", "职场打拼中", "运营自己的事业", "跳槽中", "创业中", "自由职业", "边学边工作", "已退休"],
  phase: ["迷茫期", "转型期", "低谷期", "上升期", "平稳期", "好转期"],
  supportNeeds: ["学业", "职业", "创业", "副业", "人际关系", "情感", "自我探索", "心理疗愈", "经济和理财", "兴趣发展", "目前不迷茫（老娘is thriving！🔥）"],
  purpose: ["找mentor", "做mentor", "都可以"],
  availability: ["轻量偶尔", "每周固定", "较多时间", "随缘"],
  hobbies: ["阅读", "写作", "音乐", "唱歌", "乐器", "绘画", "摄影", "电影", "音乐剧", "戏剧", "舞蹈", "追星", "二次元", "游戏", "电竞", "时尚穿搭", "美妆", "香水", "手工", "编织", "烘焙", "料理", "咖啡", "茶道", "运动健身", "瑜伽", "骑行", "徒步", "游泳", "旅行", "露营", "园艺", "宠物", "冥想", "塔罗", "占星", "编程", "设计", "投资理财", "志愿公益", "女权议题", "自定义填写"],
  expertise: ["学术研究", "文字创作", "视觉设计", "音乐制作", "视频剪辑", "编程开发", "产品设计", "市场营销", "社群运营", "创业经验", "职场晋升", "留学申请", "语言学习", "心理支持", "情感陪伴", "法律知识", "财务规划", "教育经验", "自定义填写"],
  traits: ["温柔", "理性", "感性", "直接", "细腻", "幽默", "独立", "包容", "好奇", "认真", "随性", "内敛", "开朗", "敏感", "坚韧", "浪漫", "务实", "有创意", "话少但有料", "碎碎念选手", "自定义填写"],
  experiences: ["家庭创伤", "亲密关系困境", "校园霸凌", "职场困境", "创业挫折", "考试失利", "留学经历", "跨文化生活", "心理健康挑战", "自我认同探索", "性别身份探索", "经济困难", "独立生活", "创业成功", "自我疗愈完成", "找到人生方向", "自定义填写"]
};

const countries = {
  "中国": ["北京", "上海", "广东", "浙江", "江苏", "四川", "福建", "湖北", "陕西", "其她"],
  "美国": ["加州", "纽约州", "华盛顿州", "马萨诸塞州", "德州", "其她"],
  "英国": ["伦敦", "曼彻斯特", "爱丁堡", "其她"],
  "加拿大": ["安大略", "不列颠哥伦比亚", "魁北克", "其她"],
  "澳大利亚": ["新南威尔士", "维多利亚", "昆士兰", "其她"],
  "其她": ["其她"]
};

const PROFILE_STEPS = [
  { key: "nickname", title: "希望她人怎样称呼妳？", type: "text", required: true, emoji: "🌸", layer: "第一层 · 必填" },
  { key: "age", title: "妳的年龄？", type: "age", required: true, emoji: "🫧", layer: "第一层 · 必填" },
  { key: "location", title: "妳在哪里？", type: "location", required: true, emoji: "📍", layer: "第一层 · 必填" },
  { key: "status", title: "当前状态", type: "single", required: true, choices: profileChoices.status, emoji: "🌱", layer: "第二层 · 核心匹配信息" },
  { key: "phase", title: "最近处境", type: "single", required: true, choices: profileChoices.phase, emoji: "🌤", layer: "第二层 · 核心匹配信息" },
  { key: "supportNeeds", title: "最需要支持的领域", type: "multi", required: true, choices: profileChoices.supportNeeds, emoji: "💫", layer: "第二层 · 核心匹配信息" },
  { key: "purpose", title: "来这里的目的", type: "single", required: true, choices: profileChoices.purpose, emoji: "🤝", layer: "第二层 · 核心匹配信息" },
  { key: "availability", title: "能投入的时间", type: "single", required: true, choices: profileChoices.availability, emoji: "⏳", layer: "第二层 · 核心匹配信息" },
  { key: "hobbies", title: "爱好", type: "multi", required: true, choices: profileChoices.hobbies, custom: true, emoji: "🎨", layer: "第二层 · 核心匹配信息" },
  { key: "mbti", title: "MBTI性格类型", type: "mbti", required: true, emoji: "✨", layer: "第二层 · 核心匹配信息" },
  { key: "expertise", title: "擅长或有经验的领域", type: "multi", required: true, choices: profileChoices.expertise, custom: true, emoji: "🪄", layer: "第二层 · 核心匹配信息" },
  { key: "traits", title: "性格关键词", type: "multi", required: false, choices: profileChoices.traits, custom: true, emoji: "🌙", layer: "第三层 · 选填·越详细匹配越准确💫" },
  { key: "experiences", title: "经历过的事", type: "multi", required: false, choices: profileChoices.experiences, custom: true, emoji: "🪞", layer: "第三层 · 选填·越详细匹配越准确💫" }
];

const askFields = ["职业", "情感", "心理", "学业", "创业", "兴趣", "人际", "其她"];
const zones = [
  { value: "冰川区🧊", note: "很难说出口，先被看见就好。", cls: "cool" },
  { value: "微暖区🌤", note: "想一起整理、慢慢靠近答案。", cls: "warm" },
  { value: "急热区🔥", note: "需要更快的回应和清晰支持。", cls: "hot" }
];
const priorities = ["距离近优先", "专业背景优先", "相似经历优先", "沟通舒适优先", "快速响应优先"];
const visibleOptions = ["所有人可见", "仅后台匹配到的人可见"];
const lightTouchPresets = {
  comfort: ["妳已经很努力了，先抱抱此刻的自己。", "这件事听起来真的不轻，愿妳今晚先睡个安稳觉。", "我看见妳的难，也看见妳还在往前走。"],
  advice: ["可以先把问题拆成一个今天能做的小动作。", "也许先找一个可信任的人复盘，会比独自消化轻一点。", "如果方便，妳可以先写下最担心的三件事，再逐个验证。"],
  soothe: ["🫂", "🌷", "☁️", "✨", "🤍"],
  resonance: ["我也经历过类似阶段，妳不是孤单的。", "读到这里很有共鸣，愿意把一束光递给妳。", "这个感受很真实，不需要急着否定它。"]
};
const tutorialSteps = [
  { icon: "🏠", title: "先从首页开始", text: "烦恼屋一次只推送一张问题卡。妳可以轻触回应、拉手建立深度链接，或跳过看下一张。" },
  { icon: "🤍", title: "轻触不是空按钮", text: "轻触需要发送安慰、建议、安抚表情或共鸣。内容只会给发问者本人看到。" },
  { icon: "✨", title: "发问会触发匹配", text: "写下问题后，系统会根据档案、优先级、距离、MBTI和擅长领域推荐姐妹。" },
  { icon: "💬", title: "确认后进入触碰", text: "拉手被接受后，会进入链接协议和72小时试聊。故事可以留在她意识，个人信息在我的页面管理。" }
];
const relationshipMeta = {
  mentorship: { icon: "🎓", label: "Mentorship", tone: "专注、有方向感", cls: "mentor" },
  "搭子": { icon: "👯", label: "搭子", tone: "轻松、并肩感", cls: "buddy" },
  "陪伴": { icon: "🫂", label: "轻陪伴", tone: "温柔、无压力", cls: "care" },
  "轻陪伴": { icon: "🫂", label: "轻陪伴", tone: "温柔、无压力", cls: "care" }
};
const adminReviewTypes = {
  questions: "烦恼屋问题",
  posts: "派对屋帖子",
  stories: "她意识故事"
};

let state = loadState();

function initialState() {
  const users = [
    {
      id: "TCH-1028",
      virtual: true,
      phone: "demo-a",
      accountId: "TCH-1028",
      profileComplete: true,
      temp: 35,
      avatar: "梧",
      bg: "",
      signature: "愿意陪妳把复杂的路拆成小小一步。",
      profile: {
        nickname: "梧桐",
        age: 31,
        country: "中国",
        region: "上海",
        status: "职场打拼中",
        phase: "上升期",
        supportNeeds: ["职业", "自我探索"],
        purpose: "做mentor",
        availability: "每周固定",
        hobbies: ["阅读", "电影", "运动健身", "咖啡"],
        mbti: "ENFJ",
        expertise: ["职场晋升", "市场营销", "社群运营", "心理支持"],
        traits: ["温柔", "直接", "包容"],
        experiences: ["职场困境", "找到人生方向", "独立生活"]
      }
    },
    {
      id: "TCH-2116",
      virtual: true,
      phone: "demo-b",
      accountId: "TCH-2116",
      profileComplete: true,
      temp: 42,
      avatar: "夏",
      bg: "",
      signature: "从产品到创业，喜欢把不确定变成实验。",
      profile: {
        nickname: "林夏",
        age: 28,
        country: "美国",
        region: "加州",
        status: "创业中",
        phase: "转型期",
        supportNeeds: ["创业", "职业"],
        purpose: "都可以",
        availability: "较多时间",
        hobbies: ["编程", "设计", "旅行", "女权议题"],
        mbti: "INTJ",
        expertise: ["产品设计", "编程开发", "创业经验", "留学申请"],
        traits: ["理性", "独立", "有创意"],
        experiences: ["创业挫折", "留学经历", "跨文化生活"]
      }
    },
    {
      id: "TCH-3302",
      virtual: true,
      phone: "demo-c",
      accountId: "TCH-3302",
      profileComplete: true,
      temp: 22,
      avatar: "遥",
      bg: "",
      signature: "会慢慢听，也会递一盏小灯。",
      profile: {
        nickname: "星遥",
        age: 25,
        country: "中国",
        region: "北京",
        status: "自由职业",
        phase: "好转期",
        supportNeeds: ["情感", "心理疗愈"],
        purpose: "做mentor",
        availability: "轻量偶尔",
        hobbies: ["写作", "塔罗", "冥想", "音乐剧"],
        mbti: "INFP",
        expertise: ["文字创作", "情感陪伴", "心理支持"],
        traits: ["细腻", "敏感", "浪漫"],
        experiences: ["亲密关系困境", "心理健康挑战", "自我疗愈完成"]
      }
    },
    {
      id: "TCH-4519",
      virtual: true,
      phone: "demo-d",
      accountId: "TCH-4519",
      profileComplete: true,
      temp: 18,
      avatar: "柚",
      bg: "",
      signature: "申请季和论文季都陪姐妹们走过。",
      profile: {
        nickname: "柚宁",
        age: 23,
        country: "英国",
        region: "伦敦",
        status: "在校学生",
        phase: "平稳期",
        supportNeeds: ["学业", "人际关系"],
        purpose: "都可以",
        availability: "每周固定",
        hobbies: ["摄影", "阅读", "茶道", "游泳"],
        mbti: "ISFJ",
        expertise: ["学术研究", "留学申请", "语言学习", "教育经验"],
        traits: ["认真", "内敛", "坚韧"],
        experiences: ["考试失利", "留学经历", "跨文化生活"]
      }
    },
    {
      id: "TCH-5088",
      virtual: true,
      phone: "demo-e",
      accountId: "TCH-5088",
      profileComplete: true,
      temp: 55,
      avatar: "芷",
      bg: "",
      signature: "财务规划、独立生活、从低谷往外走。",
      profile: {
        nickname: "白芷",
        age: 35,
        country: "中国",
        region: "广东",
        status: "运营自己的事业",
        phase: "上升期",
        supportNeeds: ["经济和理财", "创业"],
        purpose: "做mentor",
        availability: "不定期",
        hobbies: ["投资理财", "料理", "园艺", "瑜伽"],
        mbti: "ENTJ",
        expertise: ["财务规划", "创业经验", "法律知识", "职场晋升"],
        traits: ["务实", "直接", "包容"],
        experiences: ["经济困难", "创业成功", "独立生活"]
      }
    }
  ];

  return {
    stage: "welcome",
    users,
    currentUserId: null,
    rememberedUserId: null,
    profileStep: 0,
    profileDraft: {},
    activeNav: "home",
    activeHomeTab: "questions",
    questionCursor: 0,
    activeChatId: null,
    modal: null,
    notifications: [],
    auditLog: [],
    lastSavedAt: Date.now(),
    questions: [
      {
        id: uid("q"),
        userId: "TCH-0008",
        nickname: "小禾",
        age: 24,
        region: "浙江",
        field: "职业",
        zone: "微暖区🌤",
        priorities: ["专业背景优先", "沟通舒适优先"],
        text: "刚进入互联网运营岗位，常常觉得节奏太快，想找一位有经验的姐姐帮忙看看成长路径。",
        visibility: "所有人可见",
        createdAt: Date.now() - 5600000,
        touches: 9,
        lightReplies: []
      },
      {
        id: uid("q"),
        userId: "TCH-0009",
        nickname: "南栀",
        age: 27,
        region: "加州",
        field: "创业",
        zone: "急热区🔥",
        priorities: ["专业背景优先", "快速响应优先", "相似经历优先"],
        text: "小项目做到第一个收费版本了，但在定价和用户访谈上很卡，想听听创业姐妹的真实经验。",
        visibility: "所有人可见",
        createdAt: Date.now() - 2600000,
        touches: 6,
        lightReplies: []
      },
      {
        id: uid("q"),
        userId: "TCH-0010",
        nickname: "月鹿",
        age: 22,
        region: "北京",
        field: "心理",
        zone: "冰川区🧊",
        priorities: ["沟通舒适优先", "相似经历优先"],
        text: "最近在自我认同探索里有点孤单，想先找一个温柔的人聊聊，不需要立刻给答案。",
        visibility: "所有人可见",
        createdAt: Date.now() - 900000,
        touches: 13,
        lightReplies: []
      }
    ],
    posts: [
      { id: uid("p"), userId: "TCH-1028", nickname: "梧桐", text: "今天的工作小胜利：把一个拖了很久的项目边界说清楚了。边界感真的会救命。", image: "", likes: 18, comments: ["边界感超重要！"], saved: false, createdAt: Date.now() - 7600000 },
      { id: uid("p"), userId: "TCH-2116", nickname: "林夏", text: "派对屋开张，分享一张脑暴板。愿所有奇怪灵感都能被照顾。", image: "", likes: 24, comments: ["想看脑暴模板"], saved: false, createdAt: Date.now() - 3600000 },
      { id: uid("p"), userId: "TCH-3302", nickname: "星遥", text: "今晚的冥想关键词：把心放回身体里。", image: "", likes: 12, comments: [], saved: false, createdAt: Date.now() - 1800000 }
    ],
    stories: [
      { id: uid("s"), userId: "TCH-3302", nickname: "匿名姐妹", anonymous: true, reviewStatus: "approved", text: "我曾经以为敏感是一种缺点。小时候，家里人总说我想太多，朋友也劝我不要把每句话都放在心上。于是很长一段时间里，我努力把自己训练成一个看起来很轻松的人：不追问、不表达、不把失望说出口。后来有一天，我在深夜写日记，突然发现那些被我压下去的感受并没有消失，它们只是换成了身体里的疲惫、关系里的退缩、和一次次自我怀疑。现在我开始重新理解敏感。它让我听见语气里的犹豫，看见沉默里的求救，也让我更愿意温柔地对待自己。也许女性的生命里有很多被要求变钝的时刻，而我想把这个故事留下来，提醒另一个相似的姐妹：妳不是太多，妳只是很认真地活着。", touches: 31, createdAt: Date.now() - 9400000 },
      { id: uid("s"), userId: "TCH-5088", nickname: "白芷", anonymous: false, reviewStatus: "approved", text: "离开第一份消耗感很强的工作后，我花了很久才重新相信自己的判断。那几年我总是在证明自己值得被留下，愿意接下额外任务，愿意把周末交出去，愿意在被否定以后先反省是不是自己还不够好。真正离开的那天没有想象中潇洒，我站在地铁口哭了很久，像是终于承认自己也会累。后来我用很慢的速度重新搭生活：固定吃早餐，学会看合同，开始记账，也开始拒绝一些让我身体先发出警报的合作。现在我运营自己的小事业，依然会害怕，但我不再把害怕当成失败。女性的独立不是突然长出铠甲，而是一点点把选择权拿回手里。写下这段，是想给正在低谷里怀疑自己的姐妹一个证据：妳可以慢慢来，慢慢也算数。", touches: 27, createdAt: Date.now() - 6400000 },
      { id: uid("s"), userId: "TCH-2116", nickname: "匿名姐妹", anonymous: true, reviewStatus: "approved", text: "第一次向女性朋友坦白野心时，我以为自己会被笑。那时我刚到异国生活，语言、身份、钱、未来，每一样都像没有固定形状的雾。我说我想做一个产品，想把女性之间的经验连接起来，想让那些没有被写进主流叙事的路也被看见。朋友没有急着评价，只是拿出纸和笔，问我：那妳想先服务谁？那一刻我记了很久。原来野心也可以被温柔承接，原来女性之间不只有互相安慰，也可以互相点火、互相校准方向。后来这个念头像一颗小种子，在很多次迷茫里救过我。她意识对我来说，就是把这些未被命名的瞬间存下来：一个眼神、一句认真提问、一次被相信的经验，都可能成为另一个女性继续走的力量。", touches: 46, createdAt: Date.now() - 2400000 }
    ],
    links: [],
    chats: []
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (!saved) return initialState();
    const parsed = normalizeState({ ...initialState(), ...JSON.parse(saved) });
    const rememberedId = localStorage.getItem(SESSION_KEY) || parsed.rememberedUserId || parsed.currentUserId;
    const rememberedUser = parsed.users.find((user) => user.id === rememberedId && user.profileComplete);
    if (rememberedUser) {
      parsed.currentUserId = rememberedUser.id;
      parsed.rememberedUserId = rememberedUser.id;
      parsed.stage = "main";
    }
    return parsed;
  } catch {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      return backup ? normalizeState({ ...initialState(), ...JSON.parse(backup) }) : initialState();
    } catch {
      return initialState();
    }
  }
}

function normalizeState(nextState) {
  nextState.questionCursor = Number.isFinite(nextState.questionCursor) ? nextState.questionCursor : 0;
  nextState.questions = asArray(nextState.questions).map((question) => ({
    ...question,
    reviewStatus: question.reviewStatus || "approved",
    lightReplies: asArray(question.lightReplies)
  }));
  nextState.posts = asArray(nextState.posts).map((post) => ({
    ...post,
    reviewStatus: post.reviewStatus || "approved"
  }));
  nextState.stories = asArray(nextState.stories).map((story) => ({
    ...story,
    reviewStatus: story.reviewStatus || "approved"
  }));
  nextState.links = asArray(nextState.links).map((link) => ({
    ...link,
    type: normalizeRelationType(link.type),
    createdAt: link.createdAt || Date.now(),
    growthGoal: link.growthGoal || "建立稳定的成长节奏，把当下最卡住的问题拆成可执行的小步。",
    mentorId: link.mentorId || inferMentorId(link),
    menteeId: link.menteeId || inferMenteeId(link),
    rolesConfirmed: link.rolesConfirmed !== false,
    checkins: asArray(link.checkins),
    buddyList: asArray(link.buddyList),
    diaries: asArray(link.diaries),
    reviews: asArray(link.reviews),
    quotes: asArray(link.quotes),
    status: link.status || "进行中"
  }));
  nextState.chats = asArray(nextState.chats).map((chat) => ({
    ...chat,
    messages: asArray(chat.messages).map((msg) => ({ ...msg, id: msg.id || uid("msg"), starred: Boolean(msg.starred) }))
  }));
  nextState.users = asArray(nextState.users).map((user) => ({
    ...user,
    lastLoginAt: user.lastLoginAt || Date.now(),
    tutorialSeen: Boolean(user.tutorialSeen)
  }));
  nextState.auditLog = asArray(nextState.auditLog);
  return nextState;
}

function saveState() {
  state.lastSavedAt = Date.now();
  const payload = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, payload);
  localStorage.setItem(BACKUP_KEY, payload);
  if (state.currentUserId) localStorage.setItem(SESSION_KEY, state.currentUserId);
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeRelationType(type) {
  if (type === "Mentorship" || type === "mentor") return "mentorship";
  if (type === "轻陪伴") return "陪伴";
  return type || "mentorship";
}

function relationMeta(type) {
  return relationshipMeta[normalizeRelationType(type)] || relationshipMeta.mentorship;
}

function inferMentorId(link) {
  if (normalizeRelationType(link.type) !== "mentorship") return "";
  const members = asArray(link.memberIds);
  return link.mentorId || members[1] || members[0] || "";
}

function inferMenteeId(link) {
  if (normalizeRelationType(link.type) !== "mentorship") return "";
  const members = asArray(link.memberIds);
  return link.menteeId || members[0] || members[1] || "";
}

function isMentor(link) {
  return normalizeRelationType(link?.type) === "mentorship" && link.mentorId === state.currentUserId;
}

function isMentee(link) {
  return normalizeRelationType(link?.type) === "mentorship" && link.menteeId === state.currentUserId;
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  toastRoot.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function notify(message) {
  state.notifications.unshift({ id: uid("n"), message, createdAt: Date.now(), unread: true });
  saveAndRender();
  toast(message);
}

function visibleNotifications() {
  return asArray(state.notifications).filter((item) => !item.toUserId || item.toUserId === state.currentUserId);
}

function saveAndRender() {
  saveState();
  render();
}

function render() {
  const stage = state.stage;
  if (stage === "welcome") renderWelcome();
  if (stage === "register") renderRegister();
  if (stage === "profile") renderProfile();
  if (stage === "main") renderMain();
}

function renderWelcome() {
  const rememberedUser = state.currentUserId ? getUser(state.currentUserId) : getUser(state.rememberedUserId);
  app.innerHTML = `
    <main class="page center-page welcome">
      <section class="narrow welcome-copy">
        <p class="welcome-line one delay-1">Hey女孩！喜欢妳来🥰</p>
        <p class="welcome-line two delay-2">她触是一个全心投入女女链接，致力于女性彼此触碰、点亮的平台</p>
        <p class="welcome-line three delay-3">我们希望同妳一起探索，妳生命的温度可以如何温暖她人和自己</p>
        <div class="touch-orbit">
          <span class="orbit-dot dot-a"></span>
          <span class="orbit-dot dot-b"></span>
          <span class="orbit-dot dot-c"></span>
          <div class="touch-core">
            <span class="core-glow">她触</span>
            <button class="palm-button" data-action="start">I'm in ✨</button>
          </div>
        </div>
        ${rememberedUser?.profileComplete ? `
          <div class="card soft-panel">
            <strong>欢迎回来，${esc(rememberedUser.profile.nickname)}</strong>
            <div class="hint">这个浏览器已记住妳的账号和聊天记录。</div>
            ${state.currentUserId ? `<button class="btn secondary" data-action="continue-session">继续进入</button>` : `<button class="btn secondary" data-action="open-login">已有账号，返回登录</button>`}
          </div>
        ` : ""}
      </section>
      <button class="think-link" data-action="exit">我再想想</button>
    </main>
  `;
}

function renderRegister() {
  app.innerHTML = `
    <main class="page center-page">
      <section class="narrow card form-card lift-card">
        <div class="stack">
          <div class="brand"><span class="brand-mark">触</span><span>Touched 她触</span></div>
          <h1 class="question-title">创建妳的内测账号</h1>
          <p class="hint">手机号注册、设置密码后会自动生成个人账号ID。数据仅保存在当前浏览器 localStorage 中。</p>
          <form id="register-form" class="stack">
            <label class="field">
              <span class="label">手机号</span>
              <input class="input" name="phone" inputmode="tel" placeholder="请输入手机号" required />
            </label>
            <label class="field">
              <span class="label">设置密码</span>
              <input class="input" name="password" type="password" minlength="6" placeholder="至少6位" required />
            </label>
            <button class="btn" type="submit">生成账号ID ✨</button>
          </form>
          ${state.users.some((user) => !user.virtual && user.profileComplete) ? `<button class="btn secondary" data-action="open-login">已有账号，返回登录</button>` : ""}
        </div>
      </section>
    </main>
  `;
  document.querySelector("#register-form").addEventListener("submit", handleRegister);
}

function handleRegister(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const phone = String(data.get("phone") || "").trim();
  const password = String(data.get("password") || "").trim();
  if (phone.length < 5 || password.length < 6) {
    toast("请填写有效手机号和至少6位密码");
    return;
  }
  const id = `TCH-${Math.floor(100000 + Math.random() * 899999)}`;
  const user = {
    id,
    accountId: id,
    phone,
    password,
    virtual: false,
    profileComplete: false,
    temp: 0,
    avatar: "妳",
    bg: "",
    signature: "一句话介绍自己",
    profile: {}
  };
  state.users.push(user);
  state.currentUserId = id;
  state.rememberedUserId = id;
  state.profileDraft = {};
  state.profileStep = 0;
  state.stage = "profile";
  saveAndRender();
}

function handleLogin() {
  const loginId = document.querySelector("#login-id")?.value.trim();
  const password = document.querySelector("#login-password")?.value.trim();
  const remember = document.querySelector("#login-remember")?.checked;
  const user = state.users.find((item) => !item.virtual && (item.phone === loginId || item.accountId === loginId) && item.password === password);
  if (!user) {
    toast("没有找到匹配账号，请检查手机号/账号ID和密码");
    return;
  }
  user.lastLoginAt = Date.now();
  state.currentUserId = user.id;
  state.rememberedUserId = remember ? user.id : "";
  state.stage = user.profileComplete ? "main" : "profile";
  state.modal = null;
  if (remember) localStorage.setItem(SESSION_KEY, user.id);
  saveAndRender();
}

function renderProfile() {
  const user = currentUser();
  const step = PROFILE_STEPS[state.profileStep];
  const pct = Math.round(((state.profileStep + 1) / PROFILE_STEPS.length) * 100);
  app.innerHTML = `
    <main class="page center-page">
      <section class="narrow card form-card lift-card">
        <div class="wizard-head">
          <div class="brand"><span class="brand-mark">触</span><span>Touched 她触</span></div>
          <div class="progress"><span style="width:${pct}%"></span></div>
          <div class="hint">${esc(step.layer)} · ${state.profileStep + 1}/${PROFILE_STEPS.length}</div>
          <h1 class="question-title">${esc(step.emoji)} ${esc(step.title)}</h1>
        </div>
        <div class="stack">
          ${renderProfileField(step)}
          <div class="button-row">
            <button class="btn secondary" data-action="profile-prev" ${state.profileStep === 0 ? "disabled" : ""}>上一步</button>
            ${step.required ? "" : `<button class="btn ghost" data-action="profile-skip">跳过</button>`}
            <button class="btn" data-action="profile-next">${state.profileStep === PROFILE_STEPS.length - 1 ? "完成档案" : "下一题"}</button>
          </div>
          <p class="hint tiny">账号ID：${esc(user?.accountId || "生成中")} · 所有选择可在「我的档案」里修改。</p>
        </div>
      </section>
    </main>
  `;
}

function renderProfileField(step) {
  const value = state.profileDraft[step.key];
  if (step.type === "text") {
    return `<input class="input" id="profile-value" value="${esc(value || "")}" placeholder="比如 小玫、海盐、Luna" />`;
  }
  if (step.type === "age") {
    const ages = Array.from({ length: 73 }, (_, index) => index + 18);
    return `
      <select class="select" id="profile-value">
        <option value="">请选择</option>
        ${ages.map((age) => `<option value="${age}" ${Number(value) === age ? "selected" : ""}>${age}岁</option>`).join("")}
      </select>
    `;
  }
  if (step.type === "location") {
    const country = state.profileDraft.country || "";
    const region = state.profileDraft.region || "";
    const regionList = countries[country] || [];
    return `
      <div class="stack">
        <select class="select" id="country-select">
          <option value="">选择国家</option>
          ${Object.keys(countries).map((name) => `<option value="${esc(name)}" ${country === name ? "selected" : ""}>${esc(name)}</option>`).join("")}
        </select>
        <select class="select" id="region-select">
          <option value="">选择地区/省份</option>
          ${regionList.map((name) => `<option value="${esc(name)}" ${region === name ? "selected" : ""}>${esc(name)}</option>`).join("")}
        </select>
      </div>
    `;
  }
  if (step.type === "mbti") {
    return `
      <select class="select" id="profile-value">
        <option value="">请选择</option>
        ${MBTI.map((name) => `<option value="${name}" ${value === name ? "selected" : ""}>${name}</option>`).join("")}
      </select>
    `;
  }
  const selected = step.type === "multi" ? asArray(value) : [value].filter(Boolean);
  return `
    <div class="bubble-grid">
      ${step.choices.map((choice) => `
        <button class="bubble ${selected.includes(choice) ? "selected" : ""}" data-action="profile-bubble" data-key="${step.key}" data-kind="${step.type}" data-value="${esc(choice)}">
          ${esc(choice)}
        </button>
      `).join("")}
      ${step.custom ? `
        <div class="custom-row">
          <input class="input" id="custom-profile-value" placeholder="自定义填写" />
          <button class="btn secondary" data-action="profile-custom" data-key="${step.key}">加入</button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderMain() {
  const unread = visibleNotifications().filter((item) => item.unread).length;
  app.innerHTML = `
    <main class="main-layout page">
      <section class="wide">
        <header class="topbar">
          <div class="brand"><span class="brand-mark">触</span><span>Touched 她触</span></div>
          <div class="top-actions">
            ${state.activeNav === "home" ? `<button class="btn apricot" data-action="open-ask">发问</button>` : ""}
            ${state.activeNav === "archive" ? `<button class="btn lavender" data-action="open-story">写故事</button>` : ""}
            ${state.activeHomeTab === "party" && state.activeNav === "home" ? `<button class="btn secondary" data-action="open-post">发帖</button>` : ""}
            <button class="icon-btn" data-action="nav" data-nav="admin" title="管理员视角">🛡️</button>
            <button class="icon-btn" data-action="show-notifications" title="通知">🔔${unread ? `<span class="badge">${unread}</span>` : ""}</button>
          </div>
        </header>
        ${renderActiveView()}
      </section>
      ${renderBottomNav()}
      ${renderModal()}
    </main>
  `;
}

function renderActiveView() {
  if (state.activeNav === "home") return renderHome();
  if (state.activeNav === "touch") return renderTouch();
  if (state.activeNav === "archive") return renderArchive();
  if (state.activeNav === "admin") return renderAdmin();
  return renderMe();
}

function renderBottomNav() {
  const items = [
    ["home", "🏠", "首页"],
    ["touch", "💬", "触碰"],
    ["archive", "✨", "她意识"],
    ["me", "👤", "我的"]
  ];
  return `
    <nav class="nav">
      ${items.map(([key, icon, label]) => `
        <button class="${state.activeNav === key ? "active" : ""}" data-action="nav" data-nav="${key}">
          <span>${icon}</span><span>${label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderHome() {
  return `
    <section>
      <div class="button-row" style="justify-content:space-between">
        <div class="tabs">
          <button class="${state.activeHomeTab === "questions" ? "active" : ""}" data-action="home-tab" data-tab="questions">烦恼屋</button>
          <button class="${state.activeHomeTab === "party" ? "active" : ""}" data-action="home-tab" data-tab="party">派对屋</button>
        </div>
        <div class="hint">${state.activeHomeTab === "questions" ? "求助问题 feed" : "日常轻分享"}</div>
      </div>
      ${state.activeHomeTab === "questions" ? renderQuestionFeed() : renderPartyFeed()}
    </section>
  `;
}

function zoneClass(zone) {
  if (zone.includes("冰川")) return "cool";
  if (zone.includes("急热")) return "hot";
  return "warm";
}

function renderQuestionFeed() {
  const questions = [...state.questions].filter((q) => q.reviewStatus !== "hidden").sort((a, b) => b.createdAt - a.createdAt);
  if (!questions.length) return `<div class="empty">暂时没有新的问题。</div>`;
  const index = Math.abs(state.questionCursor || 0) % questions.length;
  const q = questions[index];
  return `
    <div class="single-feed">
      <article class="card lift-card question-card single-question-card" data-swipe-card data-id="${q.id}">
        <div>
          <div class="tag-row">
            <span class="tag ${zoneClass(q.zone)}">${esc(q.zone)}</span>
            <span class="tag purple">${esc(q.field)}</span>
            <span class="tag warm">${index + 1}/${questions.length}</span>
          </div>
          <div class="question-text">${esc(q.text)}</div>
        </div>
        <div>
          <div class="meta">来自 ${esc(q.nickname)} · ${esc(q.age)}岁 · ${esc(q.region)} · ${q.touches || 0}次轻触</div>
          <div class="hint tiny">手机端右划或点击跳过，会换一张问题推送。</div>
          <div class="card-actions">
            <button class="btn secondary" data-action="open-light-touch" data-id="${q.id}">轻触🤍</button>
            <button class="btn" data-action="hand-question" data-id="${q.id}">拉手🤝</button>
            <button class="btn ghost" data-action="skip-question" data-id="${q.id}">跳过</button>
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderPartyFeed() {
  const posts = [...state.posts].filter((post) => post.reviewStatus !== "hidden").sort((a, b) => b.createdAt - a.createdAt);
  return `
    <div class="feed-grid">
      ${posts.map((post, index) => `
        <article class="card lift-card post-card">
          <div class="person-row">
            <div class="avatar">${esc(post.nickname.slice(0, 1))}</div>
            <div><strong>${esc(post.nickname)}</strong><div class="hint tiny">${timeAgo(post.createdAt)}</div></div>
            <span class="tag ${index % 2 ? "purple" : "warm"}">派对屋</span>
          </div>
          ${post.image ? `<img class="post-image" src="${esc(post.image)}" alt="帖子图片" />` : `<div class="post-image"></div>`}
          <div>${esc(post.text)}</div>
          <div class="button-row">
            <button class="btn secondary" data-action="like-post" data-id="${post.id}">赞 ${post.likes}</button>
            <button class="btn secondary" data-action="comment-post" data-id="${post.id}">评论 ${post.comments.length}</button>
            <button class="btn secondary" data-action="save-post" data-id="${post.id}">${post.saved ? "已收藏" : "收藏"}</button>
          </div>
          ${post.comments.length ? `<div class="soft-panel">${post.comments.map((item) => `<div class="hint">💬 ${esc(item)}</div>`).join("")}</div>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function relationshipDays(link) {
  return Math.max(1, Math.ceil((Date.now() - (link.createdAt || Date.now())) / 86400000));
}

function linkForChat(chat) {
  return state.links.find((link) => link.chatId === chat.id)
    || state.links.find((link) => link.memberIds.every((id) => chat.memberIds.includes(id)));
}

function chatForLink(link) {
  return state.chats.find((chat) => chat.id === link.chatId)
    || state.chats.find((chat) => link.memberIds.every((id) => chat.memberIds.includes(id)));
}

function ensureDemoRelationships() {
  const user = currentUser();
  if (!user) return;
  const existing = state.links.filter((link) => link.memberIds.includes(user.id));
  if (existing.length) return;
  const demos = [
    {
      targetId: "TCH-1028",
      type: "mentorship",
      cycle: "1-3个月",
      frequency: "每周一次",
      goal: "三周内梳理职业方向，完成一版成长路径和两次复盘。",
      first: "我们把目标放在顶部，之后每次聊都能回到这个方向。"
    },
    {
      targetId: "TCH-2116",
      type: "搭子",
      cycle: "随缘",
      frequency: "不定期",
      goal: "一起做一个轻量项目清单，互相提醒但不互相压迫。",
      first: "今天先把想一起完成的小事列出来吧。"
    },
    {
      targetId: "TCH-3302",
      type: "陪伴",
      cycle: "长期半年以上",
      frequency: "随时",
      goal: "低压力陪伴，允许沉默，也允许只发一个心情贴纸。",
      first: "不用急着说完整，只要知道这里有人在。"
    }
  ];
  demos.forEach((demo, index) => {
    const target = getUser(demo.targetId);
    if (!target) return;
    const chatId = uid("chat");
    const linkId = uid("link");
    state.links.push({
      id: linkId,
      chatId,
      memberIds: [user.id, target.id],
      type: demo.type,
      cycle: demo.cycle,
      frequency: demo.frequency,
      status: "进行中",
      reason: "内测演示关系，用于体验不同聊天界面。",
      createdAt: Date.now() - (index + 2) * 86400000,
      growthGoal: demo.goal,
      mentorId: demo.type === "mentorship" ? target.id : "",
      menteeId: demo.type === "mentorship" ? user.id : "",
      rolesConfirmed: true,
      checkins: [],
      buddyList: demo.type === "搭子" ? ["一起完成一周三次打卡", "周末交换灵感清单"] : [],
      diaries: [],
      reviews: [],
      quotes: []
    });
    state.chats.push({
      id: chatId,
      memberIds: [user.id, target.id],
      messages: [
        { id: uid("msg"), from: target.id, text: demo.first, createdAt: Date.now() - 600000 },
        { id: uid("msg"), from: user.id, text: "收到，我想慢慢试试看。", createdAt: Date.now() - 540000 }
      ],
      createdAt: Date.now() - (index + 2) * 86400000
    });
  });
  state.activeChatId = state.chats.find((chat) => chat.memberIds.includes(user.id))?.id || state.activeChatId;
  saveState();
}

function renderTouch() {
  ensureDemoRelationships();
  const chats = state.chats.filter((chat) => chat.memberIds.includes(state.currentUserId));
  const links = state.links.filter((link) => link.memberIds.includes(state.currentUserId));
  const activeChat = chats.find((chat) => chat.id === state.activeChatId) || chats[0];
  if (!state.activeChatId && activeChat) state.activeChatId = activeChat.id;
  const activeLink = activeChat ? linkForChat(activeChat) : null;
  return `
    <section class="split">
      <div class="stack">
        <div class="card profile-card">
          <h2>触碰 · 私聊</h2>
          <div class="touch-list">
            ${chats.length ? chats.map((chat) => renderChatRow(chat)).join("") : `<div class="empty">深度链接后，私聊会出现在这里。</div>`}
          </div>
        </div>
        <div class="card profile-card">
          <h2>深度链接管理</h2>
          ${links.length ? links.map((link) => `
            <div class="soft-panel">
              <div class="tag-row">
                <span class="tag ${relationMeta(link.type).cls}">${relationMeta(link.type).icon} ${esc(relationMeta(link.type).label)}</span>
                <span class="tag warm">已建立${relationshipDays(link)}天</span>
              </div>
              <div style="margin-top:8px"><strong>${esc(link.cycle)}</strong> · ${esc(link.frequency)}</div>
              <div class="hint">状态：${esc(link.status)} · ${esc(relationMeta(link.type).tone)}</div>
              <div class="hint">匹配理由：${esc(link.reason)}</div>
            </div>
          `).join("") : `<div class="empty">确认链接后，会显示 mentorship / 搭子 / 陪伴关系。</div>`}
        </div>
      </div>
      <div class="card chat-window">
        ${activeChat && activeLink ? renderChatWindow(activeChat, activeLink) : `<div class="empty">暂无私聊</div>`}
      </div>
    </section>
  `;
}

function renderChatRow(chat) {
  const peer = getPeer(chat.memberIds);
  const last = chat.messages[chat.messages.length - 1];
  const link = linkForChat(chat);
  const meta = relationMeta(link?.type);
  return `
    <button class="soft-panel person-row ${state.activeChatId === chat.id ? "active-chat-row" : ""}" data-action="select-chat" data-id="${chat.id}" style="text-align:left">
      <div class="avatar">${esc(peer.avatar || peer.profile.nickname.slice(0, 1))}</div>
      <div>
        <strong>${esc(peer.profile.nickname)}</strong>
        <div class="hint">${esc(last?.text || "试聊已开启")}</div>
      </div>
      <span class="tag ${meta.cls}">${meta.icon} ${esc(meta.label)}</span>
    </button>
  `;
}

function renderChatWindow(chat, link) {
  const peer = getPeer(chat.memberIds);
  const meta = relationMeta(link.type);
  return `
    <div class="person-row relation-header ${meta.cls}">
      <div class="avatar">${esc(peer.avatar || peer.profile.nickname.slice(0, 1))}</div>
      <div>
        <strong>${meta.icon} ${esc(peer.profile.nickname)} · ${esc(meta.label)}</strong>
        <div class="hint">${esc(meta.tone)} · 已建立${relationshipDays(link)}天 · ${esc(link.status)}</div>
      </div>
      <span class="tag ${meta.cls}">${esc(link.frequency)}</span>
    </div>
    ${renderRelationTools(link, chat)}
    <div class="messages">
      ${chat.messages.map((msg) => renderMessage(msg, chat, link)).join("")}
    </div>
    <div class="chat-compose">
      <input class="input" id="chat-input" placeholder="写下想说的话" />
      <button class="btn" data-action="send-chat" data-id="${chat.id}">发送</button>
    </div>
  `;
}

function renderMessage(msg, chat, link) {
  const mine = msg.from === state.currentUserId;
  const quoteable = normalizeRelationType(link.type) === "mentorship";
  return `
    <div class="msg-wrap ${mine ? "mine" : "theirs"}">
      <div class="msg ${mine ? "mine" : "theirs"} ${msg.kind ? "special-msg" : ""}">
        ${msg.kind ? `<div class="tiny">${esc(msg.kind)}</div>` : ""}
        ${esc(msg.text)}
      </div>
      ${quoteable ? `<button class="quote-btn" data-action="toggle-quote" data-chat-id="${chat.id}" data-msg-id="${msg.id || ""}">${msg.starred ? "已收藏金句" : "标记成长金句"}</button>` : ""}
    </div>
  `;
}

function renderRelationTools(link, chat) {
  const type = normalizeRelationType(link.type);
  if (type === "mentorship") return renderMentorshipTools(link, chat);
  if (type === "搭子") return renderBuddyTools(link);
  return renderCareTools(link);
}

function renderMentorshipTools(link, chat) {
  const latest = asArray(link.checkins)[0];
  const mentee = getUser(link.menteeId);
  const mentor = getUser(link.mentorId);
  const pending = asArray(link.checkins).find((item) => item.status === "pending");
  return `
    <div class="relation-tools mentor">
      <div class="soft-panel goal-panel">
        <div class="tiny">成长目标固定显示</div>
        <strong>${esc(link.growthGoal)}</strong>
        <div class="hint">mentor：${esc(mentor?.profile?.nickname || "待确认")} · mentee：${esc(mentee?.profile?.nickname || "待确认")}</div>
      </div>
      <div class="tool-grid">
        ${isMentee(link) ? `<button class="btn secondary" data-action="goal-checkin" data-link-id="${link.id}">目标打卡</button>` : ""}
        ${isMentor(link) && pending ? `<button class="btn" data-action="mentor-reply-checkin" data-link-id="${link.id}" data-checkin-id="${pending.id}">回应 mentee 打卡</button>` : ""}
        <button class="btn secondary" data-action="open-diary" data-link-id="${link.id}">感受日记</button>
        <button class="btn secondary" data-action="cycle-review" data-link-id="${link.id}">周期复盘</button>
        <button class="btn secondary" data-action="renew-link" data-link-id="${link.id}">续期</button>
        <button class="btn ghost" data-action="pause-link" data-link-id="${link.id}">暂停/结束</button>
      </div>
      ${!link.rolesConfirmed ? `<div class="mini-note">身份尚未确认，目标打卡暂不可用。</div>` : ""}
      ${isMentor(link) && pending ? `<div class="mini-note">妳的 mentee ${esc(mentee?.profile?.nickname || "")} 完成一条目标打卡，快去鼓励她吧～</div>` : ""}
      <div class="hint">提醒：这段时间妳们走过了什么？写下来留个印记吧～</div>
      ${latest ? `<div class="mini-note">最近打卡：${esc(latest.text)}<br><span class="hint">状态：${latest.status === "pending" ? "等待 mentor 回应" : `mentor回应：${esc(latest.reply)}`}</span></div>` : ""}
      ${asArray(link.quotes).length ? `<div class="mini-note">成长金句：${asArray(link.quotes).map((q) => esc(q.text)).join(" / ")}</div>` : ""}
      ${asArray(link.reviews).length ? `<div class="mini-note">复盘已完成：${asArray(link.reviews).map((r) => esc(r.text)).join(" / ")}</div>` : ""}
    </div>
  `;
}

function renderBuddyTools(link) {
  return `
    <div class="relation-tools buddy">
      <div class="tool-grid">
        <button class="btn secondary" data-action="add-buddy-item" data-link-id="${link.id}">添加搭子清单</button>
        <button class="btn secondary" data-action="buddy-sticker" data-link-id="${link.id}">今日打卡贴纸</button>
        <button class="btn secondary" data-action="open-diary" data-link-id="${link.id}">感受日记</button>
        <button class="btn ghost" data-action="pause-link" data-link-id="${link.id}">暂停/结束</button>
      </div>
      <div class="hint">系统轻提醒：妳们的搭子之旅还在继续吗～</div>
      <div class="buddy-list">
        ${asArray(link.buddyList).length ? asArray(link.buddyList).map((item) => `<span class="tag warm">${esc(item)}</span>`).join("") : `<span class="hint">还没有共享清单。</span>`}
      </div>
    </div>
  `;
}

function renderCareTools(link) {
  return `
    <div class="relation-tools care">
      <div class="tool-grid">
        <button class="btn secondary" data-action="mood-sticker" data-link-id="${link.id}">今天的心情</button>
        <button class="btn secondary" data-action="voice-note" data-link-id="${link.id}">语音小留言</button>
        <button class="btn secondary" data-action="open-diary" data-link-id="${link.id}">感受日记</button>
        <button class="btn ghost" data-action="pause-link" data-link-id="${link.id}">暂停/结束</button>
      </div>
      <div class="hint">系统轻轻说：去看看她还好吗🌸</div>
    </div>
  `;
}

function renderArchive() {
  const stories = [...state.stories].filter((story) => story.reviewStatus !== "hidden").sort((a, b) => b.createdAt - a.createdAt);
  return `
    <section class="stack">
      <div class="card profile-card">
        <h1 class="question-title">她意识 · 女性集体潜意识档案库</h1>
        <p class="hint">匿名或实名发布人生故事。这里没有评论，只有轻触🤍表示看见，故事按时间倒序永久留存于当前浏览器。</p>
      </div>
      <div class="feed-grid">
        ${stories.map((story) => `
          <article class="card lift-card story-card">
            <div class="person-row">
              <div class="avatar">${story.anonymous ? "匿" : esc(story.nickname.slice(0, 1))}</div>
              <div><strong>${esc(story.nickname)}</strong><div class="hint tiny">${timeAgo(story.createdAt)}</div></div>
              <span class="tag purple">她意识</span>
            </div>
            <div style="line-height:1.8">${esc(story.text)}</div>
            <button class="btn secondary" data-action="touch-story" data-id="${story.id}">轻触🤍 ${story.touches}</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMe() {
  const user = currentUser();
  const profile = user.profile || {};
  const myQuestions = state.questions.filter((q) => q.userId === user.id);
  const myPosts = state.posts.filter((p) => p.userId === user.id);
  const myLinks = state.links.filter((link) => link.memberIds.includes(user.id));
  const bgStyle = user.bg ? `background-image:linear-gradient(135deg, rgba(232,130,154,.22), rgba(201,168,212,.18)), url('${esc(user.bg)}')` : "";
  return `
    <section class="split">
      <div class="stack">
        <div class="card profile-hero" style="${bgStyle}">
          <div class="person-row">
            <div class="avatar">${esc(user.avatar || "妳")}</div>
            <div>
              <h1 style="margin:0">${esc(profile.nickname || "未命名姐妹")}</h1>
              <div class="hint">账号ID：${esc(user.accountId)}</div>
            </div>
            <button class="btn secondary" data-action="open-me-edit">编辑</button>
          </div>
          <p>${esc(user.signature || "一句话介绍自己")}</p>
          <div class="temp-value">${user.temp || 0}🌡️</div>
          <div class="hint">本周温度值 · 每周一凌晨清零重新积累</div>
        </div>
        <div class="card profile-card">
          <h2>我的档案</h2>
          <div class="tag-row">
            ${["status", "phase", "purpose", "availability", "mbti"].map((key) => profile[key] ? `<span class="tag purple">${esc(profile[key])}</span>` : "").join("")}
          </div>
          <div class="hint">支持领域：${esc(asArray(profile.supportNeeds).join(" / ") || "待补充")}</div>
          <div class="hint">擅长领域：${esc(asArray(profile.expertise).join(" / ") || "待补充")}</div>
          <button class="btn secondary" data-action="edit-profile">重新编辑档案</button>
        </div>
      </div>
      <div class="stack">
        <div class="card profile-card">
          <h2>我发出的问题</h2>
          ${myQuestions.length ? myQuestions.map((q) => `
            <div class="soft-panel">
              <strong>${esc(q.field)}</strong>
              <div class="hint">${esc(q.text)}</div>
              ${renderPrivateLightReplies(q)}
            </div>
          `).join("") : `<div class="empty">还没有发问。</div>`}
        </div>
        <div class="card profile-card">
          <h2>我的帖子</h2>
          ${myPosts.length ? myPosts.map((p) => `<div class="soft-panel">${esc(p.text)}</div>`).join("") : `<div class="empty">派对屋发帖会显示在这里。</div>`}
        </div>
        <div class="card profile-card">
          <h2>正在陪伴我的姐妹 / 我正在陪伴的姐妹</h2>
          ${myLinks.length ? myLinks.map((link) => {
            const peer = getPeer(link.memberIds);
            return `<div class="soft-panel"><strong>${esc(peer.profile.nickname)}</strong><div class="hint">${relationMeta(link.type).icon} ${esc(relationMeta(link.type).label)} · ${esc(link.status)} · 已建立${relationshipDays(link)}天</div></div>`;
          }).join("") : `<div class="empty">拉手确认后会展示深度链接关系。</div>`}
        </div>
        <div class="card profile-card logout-zone">
          <h2>账号</h2>
          <div class="soft-panel">
            <strong>本地数据保存中</strong>
            <div class="hint">账号、档案、聊天记录、深度链接关系都保存在当前浏览器 localStorage，并有一份自动备份。不会上传到 GitHub 或任何服务器。</div>
            <div class="hint tiny">最后保存：${new Date(state.lastSavedAt || Date.now()).toLocaleString("zh-CN")}</div>
          </div>
          <p class="hint">退出后会回到最开始的欢迎界面，本机内测数据仍会保留，方便下次继续进入。</p>
          <button class="btn secondary" data-action="logout">退出登录</button>
        </div>
      </div>
    </section>
  `;
}

function renderAdmin() {
  const items = [
    ...state.questions.map((item) => ({ ...item, type: "questions", body: item.text })),
    ...state.posts.map((item) => ({ ...item, type: "posts", body: item.text })),
    ...state.stories.map((item) => ({ ...item, type: "stories", body: item.text }))
  ].sort((a, b) => b.createdAt - a.createdAt);
  const hidden = items.filter((item) => item.reviewStatus === "hidden").length;
  const pending = items.filter((item) => item.reviewStatus === "pending").length;
  const storageSize = new Blob([JSON.stringify(state)]).size;
  return `
    <section class="stack">
      <div class="card profile-card admin-hero">
        <h1 class="question-title">管理员视角</h1>
        <p class="hint">用于内测时查看运行状态、内容审核和基础错误线索。这里是本地模拟后台，不连接真实服务器。</p>
        <div class="admin-stats">
          <div class="soft-panel"><strong>${state.users.length}</strong><div class="hint">账号档案</div></div>
          <div class="soft-panel"><strong>${state.questions.length}</strong><div class="hint">烦恼屋问题</div></div>
          <div class="soft-panel"><strong>${state.links.length}</strong><div class="hint">深度链接</div></div>
          <div class="soft-panel"><strong>${Math.round(storageSize / 1024)}KB</strong><div class="hint">本地数据</div></div>
        </div>
        <div class="hint">审核提示：待审 ${pending} 条 · 已隐藏 ${hidden} 条 · 脚本运行状态正常</div>
      </div>
      <div class="split">
        <div class="card profile-card">
          <h2>文字审核</h2>
          <div class="touch-list">
            ${items.map((item) => renderReviewItem(item)).join("")}
          </div>
        </div>
        <div class="card profile-card">
          <h2>运行检查</h2>
          <div class="soft-panel">
            <strong>当前模块</strong>
            <div class="hint">注册、档案、feed、轻触、拉手、关系聊天、她意识、个人主页均已加载。</div>
          </div>
          <div class="soft-panel">
            <strong>审核动作记录</strong>
            ${state.auditLog.length ? state.auditLog.slice(0, 6).map((log) => `<div class="hint">${esc(log.text)} · ${timeAgo(log.createdAt)}</div>`).join("") : `<div class="hint">暂无记录。</div>`}
          </div>
          <button class="btn secondary" data-action="admin-scan">重新扫描</button>
        </div>
      </div>
    </section>
  `;
}

function renderReviewItem(item) {
  const status = item.reviewStatus || "approved";
  return `
    <div class="soft-panel review-item ${status}">
      <div class="tag-row">
        <span class="tag purple">${esc(adminReviewTypes[item.type])}</span>
        <span class="tag ${status === "hidden" ? "hot" : "warm"}">${status === "hidden" ? "已隐藏" : status === "pending" ? "待审" : "已通过"}</span>
      </div>
      <div class="review-text">${esc(item.body).slice(0, 220)}${item.body.length > 220 ? "..." : ""}</div>
      <div class="button-row">
        <button class="btn secondary" data-action="review-approve" data-review-type="${item.type}" data-id="${item.id}">通过</button>
        <button class="btn secondary" data-action="review-pending" data-review-type="${item.type}" data-id="${item.id}">标为待审</button>
        <button class="btn ghost" data-action="review-hide" data-review-type="${item.type}" data-id="${item.id}">隐藏</button>
      </div>
    </div>
  `;
}

function renderPrivateLightReplies(question) {
  const replies = asArray(question.lightReplies);
  if (!replies.length) return `<div class="hint tiny" style="margin-top:8px">还没有收到轻触回应。</div>`;
  return `
    <div class="divider"></div>
    <div class="hint tiny">仅妳可见的轻触回应</div>
    <div class="stack" style="gap:8px;margin-top:8px">
      ${replies.map((reply) => `
        <div class="private-touch">
          <strong>${esc(reply.fromNickname)}</strong>
          <div>${esc([...asArray(reply.messages), reply.custom].filter(Boolean).join(" "))}</div>
          <div class="hint tiny">${timeAgo(reply.createdAt)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "ask") return renderAskModal();
  if (state.modal.type === "light-touch") return renderLightTouchModal();
  if (state.modal.type === "matches") return renderMatchesModal();
  if (state.modal.type === "link-request") return renderLinkRequestModal();
  if (state.modal.type === "protocol") return renderProtocolModal();
  if (state.modal.type === "protocol-review") return renderProtocolReviewModal();
  if (state.modal.type === "link-done") return renderLinkDoneModal();
  if (state.modal.type === "post") return renderPostModal();
  if (state.modal.type === "story") return renderStoryModal();
  if (state.modal.type === "notifications") return renderNotificationsModal();
  if (state.modal.type === "me-edit") return renderMeEditModal();
  if (state.modal.type === "login") return renderLoginModal();
  if (state.modal.type === "tutorial") return renderTutorialModal();
  return "";
}

function modalWrap(content) {
  return `<div class="modal-backdrop"><section class="modal card">${content}</section></div>`;
}

function renderAskModal() {
  const step = state.modal.step || 0;
  const draft = state.modal.draft || {};
  const titles = ["第一步：选领域", "第二步：选区域", "第三步：选匹配优先级", "第四步：写下妳的问题", "第五步：选可见范围"];
  return modalWrap(`
    <div class="wizard-head">
      <div class="progress"><span style="width:${((step + 1) / 5) * 100}%"></span></div>
      <h2>${titles[step]}</h2>
    </div>
    <div class="stack">
      ${renderAskStep(step, draft)}
      <div class="button-row">
        <button class="btn secondary" data-action="ask-prev" ${step === 0 ? "disabled" : ""}>上一步</button>
        <button class="btn ghost" data-action="close-modal">取消</button>
        <button class="btn" data-action="${step === 4 ? "ask-submit" : "ask-next"}">${step === 4 ? "发布并匹配" : "下一步"}</button>
      </div>
    </div>
  `);
}

function renderLightTouchModal() {
  const question = state.questions.find((item) => item.id === state.modal.questionId);
  const draft = state.modal.draft || { kind: "comfort", picks: [] };
  if (!question) return "";
  const kindLabels = [
    ["comfort", "安慰"],
    ["advice", "建议"],
    ["soothe", "安抚表情"],
    ["resonance", "共鸣"]
  ];
  const presets = lightTouchPresets[draft.kind] || [];
  return modalWrap(`
    <h2>给 ${esc(question.nickname)} 一个轻触🤍</h2>
    <p class="hint">轻触内容只会给发问者本人看到。需要发出一点东西，才算完成轻触并增加温度值。</p>
    <div class="soft-panel">
      <span class="tag ${zoneClass(question.zone)}">${esc(question.zone)}</span>
      <span class="tag purple">${esc(question.field)}</span>
      <div style="margin-top:10px;line-height:1.7">${esc(question.text)}</div>
    </div>
    <div class="stack" style="margin-top:16px">
      <div class="tabs light-tabs">
        ${kindLabels.map(([key, label]) => `<button class="${draft.kind === key ? "active" : ""}" data-action="light-kind" data-kind="${key}">${label}</button>`).join("")}
      </div>
      <div class="bubble-grid">
        ${presets.map((item) => `<button class="bubble ${asArray(draft.picks).includes(item) ? "selected" : ""}" data-action="light-pick" data-value="${esc(item)}">${esc(item)}</button>`).join("")}
      </div>
      <textarea class="textarea" id="light-custom" placeholder="也可以补一句妳自己的回应">${esc(draft.custom || "")}</textarea>
      <div class="button-row">
        <button class="btn" data-action="send-light-touch">发送轻触</button>
        <button class="btn secondary" data-action="close-modal">取消</button>
      </div>
    </div>
  `);
}

function renderAskStep(step, draft) {
  if (step === 0) return renderPickBubbles("ask-pick", "field", askFields, draft.field, false);
  if (step === 1) {
    return `<div class="stack">${zones.map((zone) => `
      <button class="soft-panel bubble ${draft.zone === zone.value ? "selected" : ""}" data-action="ask-pick" data-key="zone" data-value="${esc(zone.value)}" style="border-radius:18px;text-align:left">
        <strong>${esc(zone.value)}</strong><div class="hint">${esc(zone.note)}</div>
      </button>
    `).join("")}</div>`;
  }
  if (step === 2) {
    return `
      <p class="hint">最多选择三个，匹配算法会优先尊重这里的选择。</p>
      ${renderPickBubbles("ask-pick", "priorities", priorities, draft.priorities || [], true)}
    `;
  }
  if (step === 3) {
    const text = draft.text || "";
    return `
      <textarea class="textarea" id="ask-text" placeholder="至少15字，写下此刻最想被回应的问题">${esc(text)}</textarea>
      <div class="hint"><span id="ask-count">${text.length}</span>/15 字起</div>
    `;
  }
  return renderPickBubbles("ask-pick", "visibility", visibleOptions, draft.visibility, false);
}

function renderPickBubbles(action, key, choices, selected, multi) {
  const arr = multi ? asArray(selected) : [selected].filter(Boolean);
  return `
    <div class="bubble-grid">
      ${choices.map((choice) => `
        <button class="bubble ${arr.includes(choice) ? "selected" : ""}" data-action="${action}" data-key="${key}" data-value="${esc(choice)}" data-multi="${multi ? "yes" : "no"}">${esc(choice)}</button>
      `).join("")}
    </div>
  `;
}

function renderMatchesModal() {
  const matches = state.modal.matches || [];
  return modalWrap(`
    <h2>智能匹配完成 ✨</h2>
    <p class="hint">系统根据档案领域、处境、需求类型、发问优先级、地理距离、MBTI兼容性、擅长领域契合度综合评分。</p>
    <div class="stack">
      ${matches.map((match, index) => `
        <div class="soft-panel person-row">
          <div class="avatar">${esc(match.user.avatar || match.user.profile.nickname.slice(0, 1))}</div>
          <div>
            <strong>${index + 1}. ${esc(match.user.profile.nickname)} · ${match.score}分</strong>
            <div class="hint">${esc(match.reasons.join(" / "))}</div>
          </div>
          <button class="btn" data-action="start-link" data-id="${match.user.id}" data-qid="${state.modal.questionId}">拉手</button>
        </div>
      `).join("")}
    </div>
    <div class="button-row" style="margin-top:16px">
      <button class="btn secondary" data-action="close-modal">稍后再看</button>
    </div>
  `);
}

function renderLinkRequestModal() {
  const target = getUser(state.modal.targetId);
  return modalWrap(`
    <h2>拉手请求已送达 🤝</h2>
    <p class="hint">${esc(target.profile.nickname)} 会收到通知。内测演示中，可以模拟对方接受或婉拒。</p>
    <div class="soft-panel">
      <strong>${esc(target.profile.nickname)}</strong>
      <div class="hint">${esc(target.signature)}</div>
    </div>
    <div class="button-row" style="margin-top:16px">
      <button class="btn" data-action="link-accept">模拟对方接受</button>
      <button class="btn secondary" data-action="link-decline">模拟婉拒</button>
      <button class="btn ghost" data-action="close-modal">稍后</button>
    </div>
  `);
}

function renderProtocolModal() {
  const expect = state.modal.expect || {};
  const target = getUser(state.modal.targetId);
  return modalWrap(`
    <h2>链接协议</h2>
    <p class="hint">A先填写期望。若选择 Mentorship，需要先确认谁是 mentor、谁是 mentee，双方确认后目标打卡才会开启。</p>
    <div class="stack">
      <label class="field"><span class="label">关系类型</span>
        <select class="select" id="link-type">
          ${["mentorship", "搭子", "陪伴"].map((item) => `<option value="${item}" ${expect.type === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </label>
      <div class="soft-panel">
        <div class="label">Mentorship 身份确认</div>
        <div class="hint">如果不是 mentorship，这里会作为关系角色备注保存。</div>
        <div class="bubble-grid" style="margin-top:10px">
          <button class="bubble ${expect.mentorId === state.currentUserId ? "selected" : ""}" data-action="role-pick" data-role="me-mentor">我是 mentor，${esc(target.profile.nickname)} 是 mentee</button>
          <button class="bubble ${expect.menteeId === state.currentUserId ? "selected" : ""}" data-action="role-pick" data-role="me-mentee">我是 mentee，${esc(target.profile.nickname)} 是 mentor</button>
        </div>
      </div>
      <label class="field"><span class="label">预期周期</span>
        <select class="select" id="link-cycle">
          ${["短期目标导向", "1-3个月", "长期半年以上", "随缘"].map((item) => `<option value="${item}" ${expect.cycle === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </label>
      <label class="field"><span class="label">沟通频率</span>
        <select class="select" id="link-frequency">
          ${["随时", "每周一次", "不定期"].map((item) => `<option value="${item}" ${expect.frequency === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </label>
      <label class="field"><span class="label">成长目标/关系目标</span>
        <textarea class="textarea" id="link-goal" placeholder="比如：三周内梳理职业方向，完成一次复盘。">${esc(expect.growthGoal || "")}</textarea>
      </label>
      <div class="button-row">
        <button class="btn" data-action="protocol-review">展示给对方</button>
        <button class="btn secondary" data-action="close-modal">取消</button>
      </div>
    </div>
  `);
}

function renderProtocolReviewModal() {
  const target = getUser(state.modal.targetId);
  const expect = state.modal.expect;
  const rounds = state.modal.rounds || 0;
  return modalWrap(`
    <h2>展示给 ${esc(target.profile.nickname)}</h2>
    <div class="soft-panel">
      <div>关系类型：<strong>${esc(expect.type)}</strong></div>
      <div>mentor：<strong>${esc(getUser(expect.mentorId)?.profile?.nickname || "待确认")}</strong></div>
      <div>mentee：<strong>${esc(getUser(expect.menteeId)?.profile?.nickname || "待确认")}</strong></div>
      <div>预期周期：<strong>${esc(expect.cycle)}</strong></div>
      <div>沟通频率：<strong>${esc(expect.frequency)}</strong></div>
      <div>共同目标：<strong>${esc(expect.growthGoal || "先从72小时试聊开始")}</strong></div>
    </div>
    <p class="hint">对方可接受或提出修改，最多协商两轮。当前第 ${rounds + 1} 轮。</p>
    <div class="button-row">
      <button class="btn" data-action="protocol-accept">对方接受</button>
      <button class="btn secondary" data-action="protocol-change">提出修改</button>
    </div>
  `);
}

function renderLinkDoneModal() {
  return modalWrap(`
    <h2>深度链接已确认 🌷</h2>
    <p class="hint">双方已收到通知，系统显示匹配理由，72小时试聊已开放。约定节点会发送温柔提醒。</p>
    <div class="loader"><span class="spark"></span><span class="spark"></span><span class="spark"></span><span>试聊空间生成中</span></div>
    <div class="button-row" style="margin-top:18px">
      <button class="btn" data-action="go-touch">去触碰页面</button>
    </div>
  `);
}

function renderPostModal() {
  return modalWrap(`
    <h2>派对屋发帖</h2>
    <div class="stack">
      <textarea class="textarea" id="post-text" placeholder="分享一点今天的光"></textarea>
      <input class="input" id="post-image" placeholder="图片URL，可留空" />
      <div class="button-row">
        <button class="btn" data-action="submit-post">发布</button>
        <button class="btn secondary" data-action="close-modal">取消</button>
      </div>
    </div>
  `);
}

function renderStoryModal() {
  return modalWrap(`
    <h2>写入她意识</h2>
    <div class="stack">
      <select class="select" id="story-name">
        <option value="anonymous">匿名发布</option>
        <option value="real">实名发布</option>
      </select>
      <textarea class="textarea" id="story-text" placeholder="写下妳愿意留存的人生故事"></textarea>
      <div class="button-row">
        <button class="btn" data-action="submit-story">发布故事</button>
        <button class="btn secondary" data-action="close-modal">取消</button>
      </div>
    </div>
  `);
}

function renderNotificationsModal() {
  const list = visibleNotifications();
  return modalWrap(`
    <h2>顶部通知</h2>
    <div class="stack">
      ${list.length ? list.map((item) => `<div class="soft-panel">${esc(item.message)}<div class="hint tiny">${timeAgo(item.createdAt)}</div></div>`).join("") : `<div class="empty">暂时没有通知。</div>`}
      <button class="btn secondary" data-action="close-modal">关闭</button>
    </div>
  `);
}

function renderMeEditModal() {
  const user = currentUser();
  return modalWrap(`
    <h2>自定义个人主页</h2>
    <div class="stack">
      <label class="field"><span class="label">头像文字或emoji</span><input class="input" id="me-avatar" value="${esc(user.avatar || "")}" /></label>
      <label class="field"><span class="label">背景图URL</span><input class="input" id="me-bg" value="${esc(user.bg || "")}" placeholder="可留空" /></label>
      <label class="field"><span class="label">个人签名</span><input class="input" id="me-signature" value="${esc(user.signature || "")}" /></label>
      <div class="button-row">
        <button class="btn" data-action="save-me-edit">保存</button>
        <button class="btn secondary" data-action="close-modal">取消</button>
      </div>
    </div>
  `);
}

function renderLoginModal() {
  return modalWrap(`
    <h2>回到妳的账号</h2>
    <p class="hint">账号数据只保存在当前浏览器。输入手机号或账号ID即可继续之前的聊天和档案。</p>
    <div class="stack">
      <label class="field"><span class="label">手机号或账号ID</span><input class="input" id="login-id" placeholder="手机号 / TCH-xxxxxx" /></label>
      <label class="field"><span class="label">密码</span><input class="input" id="login-password" type="password" placeholder="注册时设置的密码" /></label>
      <label class="remember-row"><input type="checkbox" id="login-remember" checked /> <span>记住这台设备，下次自动进入</span></label>
      <div class="button-row">
        <button class="btn" data-action="login-submit">进入她触</button>
        <button class="btn secondary" data-action="close-modal">取消</button>
      </div>
    </div>
  `);
}

function renderTutorialModal() {
  const step = state.modal.step || 0;
  const item = tutorialSteps[step];
  return modalWrap(`
    <div class="tutorial-card">
      <div class="tutorial-icon">${item.icon}</div>
      <div class="progress"><span style="width:${((step + 1) / tutorialSteps.length) * 100}%"></span></div>
      <h2>${esc(item.title)}</h2>
      <p class="hint">${esc(item.text)}</p>
      <div class="button-row">
        <button class="btn ghost" data-action="tutorial-skip">先自己逛逛</button>
        <button class="btn" data-action="tutorial-next">${step === tutorialSteps.length - 1 ? "开始使用" : "下一步"}</button>
      </div>
    </div>
  `);
}

function getUser(id) {
  return state.users.find((user) => user.id === id);
}

function getPeer(memberIds) {
  const peerId = memberIds.find((id) => id !== state.currentUserId);
  return getUser(peerId);
}

function addTemp(points) {
  const user = currentUser();
  user.temp = (user.temp || 0) + points;
}

function collectProfileField(step) {
  if (step.type === "text") {
    state.profileDraft[step.key] = document.querySelector("#profile-value")?.value.trim() || "";
  }
  if (step.type === "age") {
    state.profileDraft[step.key] = Number(document.querySelector("#profile-value")?.value || 0);
  }
  if (step.type === "location") {
    state.profileDraft.country = document.querySelector("#country-select")?.value || "";
    state.profileDraft.region = document.querySelector("#region-select")?.value || "";
    state.profileDraft.location = `${state.profileDraft.country} ${state.profileDraft.region}`.trim();
  }
  if (step.type === "mbti") {
    state.profileDraft[step.key] = document.querySelector("#profile-value")?.value || "";
  }
}

function profileHasValue(step) {
  if (!step.required) return true;
  if (step.type === "location") return Boolean(state.profileDraft.country && state.profileDraft.region);
  const value = state.profileDraft[step.key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function finishProfile() {
  const user = currentUser();
  const isFirstCompletion = !user.profileComplete;
  user.profile = { ...user.profile, ...state.profileDraft };
  user.profileComplete = true;
  if (!user.avatar || user.avatar === "妳") user.avatar = (user.profile.nickname || "妳").slice(0, 1);
  state.stage = "main";
  state.activeNav = "home";
  state.profileStep = 0;
  state.profileDraft = {};
  if (isFirstCompletion && !user.tutorialSeen) {
    state.notifications.unshift({ id: uid("n"), message: "档案完成，妳的她触空间已点亮", unread: true, createdAt: Date.now() });
    state.modal = { type: "tutorial", step: 0 };
    saveState();
    render();
    toast("档案完成，妳的她触空间已点亮");
  } else {
    notify("档案已更新");
  }
}

function toggleValue(target, key, kind, value) {
  if (value === "自定义填写") return;
  if (kind === "single") {
    state.profileDraft[key] = value;
  } else {
    const arr = asArray(state.profileDraft[key]);
    state.profileDraft[key] = arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];
  }
}

function handleAskPick(key, value, multi) {
  const draft = state.modal.draft;
  if (multi) {
    const arr = asArray(draft[key]);
    if (arr.includes(value)) draft[key] = arr.filter((item) => item !== value);
    else if (arr.length < 3) draft[key] = [...arr, value];
    else toast("最多选择三个优先级");
  } else {
    draft[key] = value;
  }
  saveAndRender();
}

function collectAskText() {
  if (state.modal?.type === "ask" && state.modal.step === 3) {
    state.modal.draft.text = document.querySelector("#ask-text")?.value.trim() || "";
  }
}

function askStepValid() {
  const draft = state.modal.draft;
  const step = state.modal.step;
  if (step === 0) return Boolean(draft.field);
  if (step === 1) return Boolean(draft.zone);
  if (step === 2) return asArray(draft.priorities).length > 0;
  if (step === 3) {
    collectAskText();
    return (draft.text || "").length >= 15;
  }
  return Boolean(draft.visibility);
}

function submitQuestion() {
  if (!askStepValid()) {
    toast("请先完成当前步骤");
    return;
  }
  const user = currentUser();
  const profile = user.profile || {};
  const draft = state.modal.draft;
  const question = {
    id: uid("q"),
    userId: user.id,
    nickname: profile.nickname,
    age: profile.age,
    region: profile.region,
    field: draft.field,
    zone: draft.zone,
    priorities: draft.priorities || [],
    text: draft.text,
    visibility: draft.visibility,
    createdAt: Date.now(),
    touches: 0,
    lightReplies: []
  };
  state.questions.unshift(question);
  addTemp(10);
  const matches = computeMatches(question);
  state.modal = { type: "matches", questionId: question.id, matches };
  state.notifications.unshift({ id: uid("n"), message: "发问成功 +10🌡️，系统已送来匹配推荐", unread: true, createdAt: Date.now() });
  saveAndRender();
}

function nextQuestion() {
  const total = state.questions.length || 1;
  state.questionCursor = ((state.questionCursor || 0) + 1) % total;
}

function collectLightDraft() {
  if (state.modal?.type === "light-touch") {
    state.modal.draft.custom = document.querySelector("#light-custom")?.value.trim() || "";
  }
}

function sendLightTouch() {
  collectLightDraft();
  const question = state.questions.find((item) => item.id === state.modal.questionId);
  if (!question) return;
  const draft = state.modal.draft || {};
  const picks = asArray(draft.picks);
  const custom = draft.custom || "";
  if (!picks.length && !custom) {
    toast("请先选择或写下一点回应");
    return;
  }
  question.lightReplies = asArray(question.lightReplies);
  question.lightReplies.unshift({
    id: uid("lt"),
    fromUserId: state.currentUserId,
    fromNickname: currentUser()?.profile?.nickname || "一位姐妹",
    kind: draft.kind || "comfort",
    messages: picks,
    custom,
    createdAt: Date.now(),
    privateToQuestionOwner: true
  });
  question.touches = (question.touches || 0) + 1;
  addTemp(5);
  const isOwner = question.userId === state.currentUserId;
  state.notifications.unshift({
    id: uid("n"),
    message: isOwner ? "妳给自己的问题留下一次轻触 +5🌡️" : `轻触已私密送给 ${question.nickname} +5🌡️`,
    unread: true,
    createdAt: Date.now()
  });
  state.modal = null;
  nextQuestion();
  saveAndRender();
  toast("轻触已送达");
}

function computeMatches(question) {
  const user = currentUser();
  const profile = user.profile || {};
  return state.users
    .filter((candidate) => candidate.id !== user.id && candidate.profileComplete)
    .map((candidate) => {
      const c = candidate.profile;
      const reasons = [];
      let score = 20;
      const pr = question.priorities || [];

      if (asArray(c.expertise).some((item) => fieldMatches(question.field, item))) {
        score += pr.includes("专业背景优先") ? 28 : 14;
        reasons.push("专业背景契合");
      }
      if (asArray(c.experiences).some((item) => asArray(profile.experiences).includes(item))) {
        score += pr.includes("相似经历优先") ? 22 : 10;
        reasons.push("相似经历可参考");
      }
      if (c.region === profile.region || c.country === profile.country) {
        score += pr.includes("距离近优先") ? 24 : 8;
        reasons.push("地区距离更近");
      }
      if (mbtiFit(profile.mbti, c.mbti)) {
        score += pr.includes("沟通舒适优先") ? 18 : 9;
        reasons.push("MBTI沟通参考较舒适");
      }
      if (c.availability === "较多时间" || c.availability === "每周固定") {
        score += pr.includes("快速响应优先") ? 20 : 6;
        reasons.push("响应节奏更稳定");
      }
      if (c.purpose === "做mentor" || c.purpose === "都可以") {
        score += 12;
        reasons.push("愿意提供陪伴或mentor支持");
      }
      if (asArray(c.supportNeeds).includes(question.field)) {
        score += 5;
        reasons.push("对该领域有共鸣");
      }
      if (!reasons.length) reasons.push("综合档案互补");
      return { user: candidate, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function fieldMatches(field, expertise) {
  const map = {
    "职业": ["职场晋升", "市场营销", "社群运营", "产品设计"],
    "情感": ["情感陪伴", "心理支持"],
    "心理": ["心理支持", "情感陪伴"],
    "学业": ["学术研究", "留学申请", "语言学习", "教育经验"],
    "创业": ["创业经验", "产品设计", "财务规划", "法律知识"],
    "兴趣": ["文字创作", "视觉设计", "音乐制作", "视频剪辑"],
    "人际": ["心理支持", "社群运营", "教育经验"],
    "其她": ["心理支持", "教育经验", "文字创作"]
  };
  return (map[field] || []).includes(expertise);
}

function mbtiFit(a, b) {
  if (!a || !b) return false;
  return a[0] === b[0] || a[3] === b[3] || (a.includes("N") && b.includes("N"));
}

function startLink(targetId, questionId) {
  state.modal = { type: "link-request", targetId, questionId };
  saveAndRender();
}

function createLink() {
  const target = getUser(state.modal.targetId);
  const expect = state.modal.expect;
  const chatId = uid("chat");
  const reason = computeMatches(state.questions.find((q) => q.id === state.modal.questionId) || state.questions[0])
    .find((match) => match.user.id === target.id)?.reasons.join(" / ") || "档案综合契合";
  state.links.unshift({
    id: uid("link"),
    chatId,
    memberIds: [state.currentUserId, target.id],
    type: normalizeRelationType(expect.type),
    cycle: expect.cycle,
    frequency: expect.frequency,
    status: "进行中",
    reason,
    growthGoal: state.modal.growthGoal || "先把当下最想成长的一件事说清楚，再一起走一小段。",
    mentorId: expect.mentorId || target.id,
    menteeId: expect.menteeId || state.currentUserId,
    rolesConfirmed: normalizeRelationType(expect.type) !== "mentorship" || Boolean(expect.mentorId && expect.menteeId),
    checkins: [],
    buddyList: [],
    diaries: [],
    reviews: [],
    quotes: [],
    createdAt: Date.now()
  });
  state.chats.unshift({
    id: chatId,
    memberIds: [state.currentUserId, target.id],
    messages: [
      { id: uid("msg"), from: target.id, text: "我接受了拉手请求。我们先从72小时试聊开始吧。", createdAt: Date.now() },
      { id: uid("msg"), from: state.currentUserId, text: "谢谢妳愿意接住我，期待慢慢聊。", createdAt: Date.now() + 1 }
    ],
    createdAt: Date.now()
  });
  state.activeChatId = chatId;
  addTemp(20);
  state.notifications.unshift({ id: uid("n"), message: `拉手被 ${target.profile.nickname} 接受 +20🌡️，72小时试聊已开放`, unread: true, createdAt: Date.now() });
  state.modal = { type: "link-done" };
  saveAndRender();
}

function findLink(id) {
  return state.links.find((link) => link.id === id);
}

function appendRelationMessage(link, text, kind = "") {
  if (!link) return;
  const chat = chatForLink(link);
  if (!chat) return;
  chat.messages.push({ id: uid("msg"), from: state.currentUserId, text, kind, createdAt: Date.now() });
}

function runGoalCheckin(link) {
  if (!link) return;
  if (!link.rolesConfirmed || !isMentee(link)) {
    toast("只有确认身份后的 mentee 可以发起目标打卡");
    return;
  }
  const text = window.prompt("写下这次目标打卡进展");
  if (!text) return;
  const checkin = { id: uid("check"), text, reply: "", status: "pending", createdAt: Date.now(), menteeId: state.currentUserId };
  link.checkins.unshift(checkin);
  const mentee = currentUser();
  state.notifications.unshift({
    id: uid("n"),
    toUserId: link.mentorId,
    message: `妳的 mentee ${mentee.profile.nickname} 完成一条目标打卡，快去鼓励她吧～`,
    unread: true,
    createdAt: Date.now()
  });
  appendRelationMessage(link, `目标打卡：${text}\n等待 mentor 回应。`, "目标打卡");
}

function mentorReplyCheckin(link, checkinId) {
  if (!link || !isMentor(link)) {
    toast("只有 mentor 可以回应 mentee 的目标打卡");
    return;
  }
  const checkin = asArray(link.checkins).find((item) => item.id === checkinId);
  if (!checkin) return;
  const reply = window.prompt("写下给 mentee 的鼓励或建议");
  if (!reply) return;
  checkin.reply = reply;
  checkin.status = "replied";
  checkin.repliedAt = Date.now();
  const mentor = currentUser();
  state.notifications.unshift({
    id: uid("n"),
    toUserId: link.menteeId,
    message: `${mentor.profile.nickname} 回应了妳的目标打卡`,
    unread: true,
    createdAt: Date.now()
  });
  appendRelationMessage(link, `mentor回应：${reply}`, "目标回应");
}

function writeDiary(link) {
  if (!link) return;
  const text = window.prompt("写下只给自己看的感受日记");
  if (!text) return;
  link.diaries.unshift({ id: uid("diary"), userId: state.currentUserId, text, createdAt: Date.now(), private: true });
  toast("感受日记已保存，仅自己可见");
}

function runCycleReview(link) {
  if (!link) return;
  const text = window.prompt("写下这段周期的简单复盘感受");
  if (!text) return;
  link.reviews.unshift({ id: uid("review"), userId: state.currentUserId, text, createdAt: Date.now() });
  appendRelationMessage(link, `周期复盘：${text}`, "复盘");
  if (window.confirm("要把这段关系标记为正式毕业吗？取消则保持进行中。")) {
    link.status = "正式毕业";
    currentUser().graduations = asArray(currentUser().graduations);
    const peer = getPeer(link.memberIds);
    currentUser().graduations.unshift({ peerName: peer.profile.nickname, type: link.type, createdAt: Date.now() });
  }
}

function addBuddyItem(link) {
  if (!link) return;
  const text = window.prompt("添加一件想一起完成的事");
  if (!text) return;
  link.buddyList.push(text);
  appendRelationMessage(link, `新增搭子清单：${text}`, "搭子清单");
}

function sendBuddySticker(link) {
  if (!link) return;
  const sticker = window.prompt("选择今日打卡小贴纸", "🌷 今天也并肩了一下");
  if (!sticker) return;
  appendRelationMessage(link, sticker, "今日打卡");
}

function sendMoodSticker(link) {
  if (!link) return;
  const mood = window.prompt("发一个今天的心情贴纸", "☁️ 今天有点软软的");
  if (!mood) return;
  appendRelationMessage(link, mood, "今天的心情");
}

function sendVoiceNote(link) {
  if (!link) return;
  const note = window.prompt("模拟语音小留言内容");
  if (!note) return;
  appendRelationMessage(link, `语音小留言：${note}`, "语音");
}

function pauseOrEndLink(link) {
  if (!link) return;
  if (!window.confirm("确认暂停或结束这段关系吗？系统不会追问原因。")) return;
  link.status = link.status === "已暂停" ? "已结束" : "已暂停";
  appendRelationMessage(link, `关系状态更新：${link.status}`, "系统");
}

function renewLink(link) {
  if (!link) return;
  const cycle = window.prompt("写下新的周期约定", link.cycle || "1-3个月");
  if (!cycle) return;
  link.cycle = cycle;
  link.status = "进行中";
  appendRelationMessage(link, `关系已续期：${cycle}`, "续期");
}

function reviewCollection(type) {
  if (type === "questions") return state.questions;
  if (type === "posts") return state.posts;
  return state.stories;
}

function setReviewStatus(type, id, status) {
  const item = reviewCollection(type).find((entry) => entry.id === id);
  if (!item) return;
  item.reviewStatus = status;
  state.auditLog.unshift({ id: uid("audit"), text: `${adminReviewTypes[type]} 已${status === "hidden" ? "隐藏" : status === "pending" ? "标为待审" : "通过"}`, createdAt: Date.now() });
}

function timeAgo(ts) {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  return `${Math.round(hours / 24)}天前`;
}

app.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  if (action === "start") {
    state.stage = "register";
    saveAndRender();
  }
  if (action === "continue-session") {
    state.stage = "main";
    state.activeNav = "home";
    saveAndRender();
  }
  if (action === "open-login") {
    state.modal = { type: "login" };
    saveAndRender();
  }
  if (action === "login-submit") {
    handleLogin();
  }
  if (action === "exit") toast("妳可以随时再回来，这束光会一直在这里。");
  if (action === "profile-bubble") {
    toggleValue(el, el.dataset.key, el.dataset.kind, el.dataset.value);
    saveAndRender();
  }
  if (action === "profile-custom") {
    const step = PROFILE_STEPS[state.profileStep];
    const value = document.querySelector("#custom-profile-value")?.value.trim();
    if (!value) return toast("请先写下自定义内容");
    const arr = asArray(state.profileDraft[step.key]).filter((item) => item !== "自定义填写");
    state.profileDraft[step.key] = arr.includes(value) ? arr : [...arr, value];
    saveAndRender();
  }
  if (action === "profile-prev") {
    collectProfileField(PROFILE_STEPS[state.profileStep]);
    state.profileStep = Math.max(0, state.profileStep - 1);
    saveAndRender();
  }
  if (action === "profile-skip") {
    state.profileStep = Math.min(PROFILE_STEPS.length - 1, state.profileStep + 1);
    saveAndRender();
  }
  if (action === "profile-next") {
    const step = PROFILE_STEPS[state.profileStep];
    collectProfileField(step);
    if (!profileHasValue(step)) return toast("这一题是必填项");
    if (state.profileStep === PROFILE_STEPS.length - 1) finishProfile();
    else {
      state.profileStep += 1;
      saveAndRender();
    }
  }
  if (action === "nav") {
    state.activeNav = el.dataset.nav;
    state.modal = null;
    saveAndRender();
  }
  if (action === "home-tab") {
    state.activeHomeTab = el.dataset.tab;
    saveAndRender();
  }
  if (action === "open-ask") {
    state.modal = { type: "ask", step: 0, draft: { priorities: [], visibility: "所有人可见" } };
    saveAndRender();
  }
  if (action === "close-modal") {
    state.modal = null;
    saveAndRender();
  }
  if (action === "ask-pick") handleAskPick(el.dataset.key, el.dataset.value, el.dataset.multi === "yes");
  if (action === "ask-prev") {
    collectAskText();
    state.modal.step = Math.max(0, state.modal.step - 1);
    saveAndRender();
  }
  if (action === "ask-next") {
    if (!askStepValid()) return toast("请先完成当前步骤");
    state.modal.step += 1;
    saveAndRender();
  }
  if (action === "ask-submit") submitQuestion();
  if (action === "open-light-touch") {
    state.modal = { type: "light-touch", questionId: el.dataset.id, draft: { kind: "comfort", picks: [], custom: "" } };
    saveAndRender();
  }
  if (action === "light-kind") {
    collectLightDraft();
    state.modal.draft.kind = el.dataset.kind;
    state.modal.draft.picks = [];
    saveAndRender();
  }
  if (action === "light-pick") {
    collectLightDraft();
    const picks = asArray(state.modal.draft.picks);
    const value = el.dataset.value;
    state.modal.draft.picks = picks.includes(value) ? picks.filter((item) => item !== value) : [...picks, value];
    saveAndRender();
  }
  if (action === "send-light-touch") {
    sendLightTouch();
  }
  if (action === "skip-question") {
    nextQuestion();
    saveAndRender();
  }
  if (action === "hand-question") {
    const q = state.questions.find((item) => item.id === el.dataset.id);
    const matches = computeMatches(q);
    startLink(matches[0]?.user.id || state.users.find((u) => u.virtual).id, q.id);
  }
  if (action === "start-link") startLink(el.dataset.id, el.dataset.qid);
  if (action === "link-decline") {
    state.modal = null;
    toast("对方暂时没有余力");
    saveAndRender();
  }
  if (action === "link-accept") {
    state.modal = {
      ...state.modal,
      type: "protocol",
      expect: {
        type: "mentorship",
        cycle: "1-3个月",
        frequency: "每周一次",
        mentorId: state.modal.targetId,
        menteeId: state.currentUserId,
        growthGoal: ""
      },
      rounds: 0
    };
    saveAndRender();
  }
  if (action === "role-pick") {
    const targetId = state.modal.targetId;
    if (el.dataset.role === "me-mentor") {
      state.modal.expect.mentorId = state.currentUserId;
      state.modal.expect.menteeId = targetId;
    } else {
      state.modal.expect.mentorId = targetId;
      state.modal.expect.menteeId = state.currentUserId;
    }
    saveAndRender();
  }
  if (action === "protocol-review") {
    state.modal.expect = {
      type: document.querySelector("#link-type").value,
      cycle: document.querySelector("#link-cycle").value,
      frequency: document.querySelector("#link-frequency").value,
      growthGoal: document.querySelector("#link-goal").value.trim(),
      mentorId: state.modal.expect.mentorId,
      menteeId: state.modal.expect.menteeId
    };
    if (state.modal.expect.type === "mentorship" && (!state.modal.expect.mentorId || !state.modal.expect.menteeId)) {
      toast("请先确认 mentor 和 mentee 身份");
      return;
    }
    state.modal.growthGoal = state.modal.expect.growthGoal;
    state.modal.type = "protocol-review";
    saveAndRender();
  }
  if (action === "protocol-change") {
    const rounds = state.modal.rounds || 0;
    if (rounds >= 1) {
      toast("妳们的期望有些不同，但可以先试聊看看～");
      createLink();
    } else {
      state.modal.rounds = rounds + 1;
      state.modal.type = "protocol";
      state.modal.expect.frequency = "不定期";
      toast("对方提出修改：先从不定期沟通开始");
      saveAndRender();
    }
  }
  if (action === "protocol-accept") createLink();
  if (action === "go-touch") {
    state.modal = null;
    state.activeNav = "touch";
    saveAndRender();
  }
  if (action === "select-chat") {
    state.activeChatId = el.dataset.id;
    saveAndRender();
  }
  if (action === "send-chat") {
    const text = document.querySelector("#chat-input")?.value.trim();
    if (!text) return;
    const chat = state.chats.find((item) => item.id === el.dataset.id);
    chat.messages.push({ id: uid("msg"), from: state.currentUserId, text, createdAt: Date.now() });
    saveAndRender();
  }
  if (action === "toggle-quote") {
    const chat = state.chats.find((item) => item.id === el.dataset.chatId);
    const msg = chat?.messages.find((item) => item.id === el.dataset.msgId);
    const link = chat ? linkForChat(chat) : null;
    if (msg && link) {
      msg.starred = !msg.starred;
      link.quotes = asArray(link.quotes);
      link.quotes = msg.starred
        ? [{ id: uid("quote"), text: msg.text, createdAt: Date.now() }, ...link.quotes]
        : link.quotes.filter((quote) => quote.text !== msg.text);
      saveAndRender();
    }
  }
  if (action === "goal-checkin") {
    runGoalCheckin(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "mentor-reply-checkin") {
    mentorReplyCheckin(findLink(el.dataset.linkId), el.dataset.checkinId);
    saveAndRender();
  }
  if (action === "open-diary") {
    writeDiary(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "cycle-review") {
    runCycleReview(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "add-buddy-item") {
    addBuddyItem(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "buddy-sticker") {
    sendBuddySticker(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "mood-sticker") {
    sendMoodSticker(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "voice-note") {
    sendVoiceNote(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "pause-link") {
    pauseOrEndLink(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "renew-link") {
    renewLink(findLink(el.dataset.linkId));
    saveAndRender();
  }
  if (action === "open-post") {
    state.modal = { type: "post" };
    saveAndRender();
  }
  if (action === "submit-post") {
    const text = document.querySelector("#post-text")?.value.trim();
    const image = document.querySelector("#post-image")?.value.trim();
    if (!text) return toast("请写一点内容");
    const user = currentUser();
    state.posts.unshift({ id: uid("p"), userId: user.id, nickname: user.profile.nickname, text, image, likes: 0, comments: [], saved: false, reviewStatus: "approved", createdAt: Date.now() });
    state.modal = null;
    saveAndRender();
  }
  if (action === "like-post") {
    const post = state.posts.find((item) => item.id === el.dataset.id);
    post.likes += 1;
    saveAndRender();
  }
  if (action === "comment-post") {
    const post = state.posts.find((item) => item.id === el.dataset.id);
    post.comments.push("已收到一枚温柔评论");
    saveAndRender();
  }
  if (action === "save-post") {
    const post = state.posts.find((item) => item.id === el.dataset.id);
    post.saved = !post.saved;
    saveAndRender();
  }
  if (action === "open-story") {
    state.modal = { type: "story" };
    saveAndRender();
  }
  if (action === "submit-story") {
    const mode = document.querySelector("#story-name")?.value;
    const text = document.querySelector("#story-text")?.value.trim();
    if (!text) return toast("请先写下故事");
    const user = currentUser();
    state.stories.unshift({ id: uid("s"), userId: user.id, nickname: mode === "anonymous" ? "匿名姐妹" : user.profile.nickname, anonymous: mode === "anonymous", text, touches: 0, reviewStatus: "approved", createdAt: Date.now() });
    state.modal = null;
    saveAndRender();
  }
  if (action === "touch-story") {
    const story = state.stories.find((item) => item.id === el.dataset.id);
    story.touches += 1;
    saveAndRender();
  }
  if (action === "show-notifications") {
    visibleNotifications().forEach((item) => { item.unread = false; });
    state.modal = { type: "notifications" };
    saveAndRender();
  }
  if (action === "open-me-edit") {
    state.modal = { type: "me-edit" };
    saveAndRender();
  }
  if (action === "save-me-edit") {
    const user = currentUser();
    user.avatar = document.querySelector("#me-avatar")?.value.trim().slice(0, 2) || user.avatar;
    user.bg = document.querySelector("#me-bg")?.value.trim() || "";
    user.signature = document.querySelector("#me-signature")?.value.trim() || user.signature;
    state.modal = null;
    saveAndRender();
  }
  if (action === "edit-profile") {
    const user = currentUser();
    state.profileDraft = { ...user.profile };
    state.profileStep = 0;
    state.stage = "profile";
    state.modal = null;
    saveAndRender();
  }
  if (action === "logout") {
    state.currentUserId = null;
    state.stage = "welcome";
    state.activeNav = "home";
    state.activeChatId = null;
    state.modal = null;
    localStorage.removeItem(SESSION_KEY);
    saveAndRender();
  }
  if (action === "review-approve" || action === "review-pending" || action === "review-hide") {
    const status = action === "review-hide" ? "hidden" : action === "review-pending" ? "pending" : "approved";
    setReviewStatus(el.dataset.reviewType, el.dataset.id, status);
    saveAndRender();
  }
  if (action === "admin-scan") {
    state.auditLog.unshift({ id: uid("audit"), text: "运行检查完成，未发现脚本错误", createdAt: Date.now() });
    saveAndRender();
    toast("扫描完成");
  }
  if (action === "tutorial-next") {
    const user = currentUser();
    if ((state.modal.step || 0) >= tutorialSteps.length - 1) {
      user.tutorialSeen = true;
      state.modal = null;
    } else {
      state.modal.step += 1;
    }
    saveAndRender();
  }
  if (action === "tutorial-skip") {
    const user = currentUser();
    user.tutorialSeen = true;
    state.modal = null;
    saveAndRender();
  }
});

app.addEventListener("change", (event) => {
  if (event.target.id === "country-select") {
    state.profileDraft.country = event.target.value;
    state.profileDraft.region = "";
    saveAndRender();
  }
});

app.addEventListener("input", (event) => {
  if (event.target.id === "ask-text") {
    const count = document.querySelector("#ask-count");
    if (count) count.textContent = event.target.value.length;
  }
});

let swipeStartX = 0;
let swipeStartY = 0;

app.addEventListener("touchstart", (event) => {
  const card = event.target.closest("[data-swipe-card]");
  if (!card || event.touches.length !== 1) return;
  swipeStartX = event.touches[0].clientX;
  swipeStartY = event.touches[0].clientY;
}, { passive: true });

app.addEventListener("touchend", (event) => {
  const card = event.target.closest("[data-swipe-card]");
  if (!card || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - swipeStartX;
  const dy = event.changedTouches[0].clientY - swipeStartY;
  if (dx > 72 && Math.abs(dy) < 70) {
    nextQuestion();
    saveAndRender();
  }
}, { passive: true });

window.addEventListener("beforeunload", () => {
  saveState();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState();
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY || event.key === BACKUP_KEY || event.key === SESSION_KEY) {
    state = loadState();
    render();
  }
});

render();
