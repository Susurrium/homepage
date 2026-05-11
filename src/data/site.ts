export const site = {
  title: '你的名字 | 个人主页',
  shortTitle: '你的名字',
  description: '一个用于展示个人介绍、技术博客、项目作品与学术经历的现代个人主页。',
  url: 'https://example.com',
  author: '你的名字',
  location: '北京 / 远程',
  email: 'hello@example.com',
  avatar: '/images/profile.svg',
  nav: [
    { href: '/', label: '首页' },
    { href: '/blog/', label: '博客' },
    { href: '/projects/', label: '项目' },
    { href: '/publications/', label: '成果' },
    { href: '/about/', label: '关于' },
    { href: '/links/', label: '友链' }
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: 'Email', href: 'mailto:hello@example.com', icon: 'mail' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' }
  ],
  profile: {
    headline: '关注软件工程、数据分析与长期写作',
    summary:
      '这里可以写你的专业方向、正在做的项目和长期兴趣。本站按个人主页、博客、项目、成果四个核心模块组织，适合技术、科研、设计或产品方向持续维护。',
    keywords: ['Astro', 'TypeScript', '数据分析', '产品思维', '写作'],
    availability: '开放交流 / 项目合作 / 实习机会'
  },
  stats: [
    { label: '文章', value: '12+' },
    { label: '项目', value: '6' },
    { label: '领域', value: '4' }
  ],
  education: [
    {
      school: '某某大学',
      degree: '本科 / 硕士',
      period: '2023 - 2027',
      detail: '专业方向：计算机、医学工程、数据科学或你自己的方向。'
    }
  ],
  experience: [
    {
      title: '个人知识库与博客建设',
      org: '长期项目',
      period: '2025 - 至今',
      detail: '围绕学习笔记、工程实践和项目复盘建立稳定输出系统。'
    },
    {
      title: '数据分析与可视化实践',
      org: '课程 / 竞赛 / 研究',
      period: '2024 - 2026',
      detail: '使用 Python、SQL 和前端可视化工具完成数据处理、建模与展示。'
    }
  ],
  skills: [
    {
      group: '工程',
      items: ['TypeScript', 'Astro', 'React', 'Node.js', 'Git']
    },
    {
      group: '数据',
      items: ['Python', 'Pandas', 'SQL', '可视化', '统计分析']
    },
    {
      group: '写作',
      items: ['技术文档', '项目复盘', '论文阅读', '长期笔记']
    }
  ],
  links: [
    {
      name: 'Astro',
      href: 'https://astro.build/',
      description: '本站使用的静态站点框架。'
    },
    {
      name: 'GitHub Pages',
      href: 'https://pages.github.com/',
      description: '适合托管静态个人主页。'
    },
    {
      name: 'Cloudflare Pages',
      href: 'https://pages.cloudflare.com/',
      description: '推荐的免费部署平台。'
    }
  ]
};
