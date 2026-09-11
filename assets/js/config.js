// 课程配置数据
const COURSES_CONFIG = [
  {
    id: "ai-cognition-online",
    name: "企业AI认知课·线上录播",
    price: 19.9,
    original_price: 99,
    description: "约100分钟，6章内容，购买后30天有效。适合零基础入门，建立AI认知框架。",
    cover_image: "assets/images/course-ai-cognition-online.svg",
    tags: ["入门", "录播"],

    detail: {
      duration: "约100分钟",
      chapters: 6,
      validity: "30天",
      format: "视频录播"
    }
  },
  {
    id: "ai-cognition-offline",
    name: "企业AI认知课·小镇现场版",
    price: 168,
    original_price: 168,
    description: "3.5小时现场课，20席限量。长江商学院同学免费，外部用户168元。",
    cover_image: "assets/images/course-ai-cognition-offline.svg",
    tags: ["线下", "现场"],

    detail: {
      duration: "3.5小时",
      seats: 20,
      format: "线下现场"
    }
  },
  {
    id: "workbuddy",
    name: "WorkBuddy启动课",
    price: 1990,
    original_price: 1990,
    description: "1天集中学习 + 7天陪跑。围绕真实工作问题，把「我想用AI」变成可复用的工作流。",
    cover_image: "assets/images/course-workbuddy.svg",
    tags: ["实战", "陪跑"],

    detail: {
      duration: "1天 + 7天陪跑",
      format: "线下+线上"
    }
  },
  {
    id: "codex",
    name: "Codex项目课",
    price: 6999,
    original_price: 6999,
    description: "2天学习 + 14天陪跑。从一个业务问题开始，做一个可运行原型。",
    cover_image: "assets/images/course-codex.svg",
    tags: ["项目", "深度"],

    detail: {
      duration: "2天 + 14天陪跑",
      format: "线下+线上"
    }
  },
  {
    id: "annual-member",
    name: "AI实践会员（年度）",
    price: 5000,
    original_price: 5000,
    description: "全年周末答疑 + 同伴交流。周六14:00-16:00主题答疑，周日14:00-16:00项目门诊。",
    cover_image: "assets/images/course-annual-member.svg",
    tags: ["会员", "持续"],

    detail: {
      duration: "12个月",
      sessions: "全年不少于80场"
    }
  },
  {
    id: "architect-year",
    name: "AI架构师年度计划",
    price: 29999,
    original_price: 35800,
    description: "8模块 + 12个月完整课程。包含认知课、WorkBuddy、Codex、SOP拆解、内容运营、销售转化、管理看板、FDE交付。",
    cover_image: "assets/images/course-architect-year.svg",
    tags: ["年度", "架构师"],

    detail: {
      duration: "12个月",
      modules: 8,
      days: 12
    }
  }
];

// 推广展示配置（公开版本）
// 佣金比例与推广码已移至服务端，此处仅保留用于界面展示的名称
const AFFILIATE_CONFIG = {
  tzb_name: "通州小兵"
};
