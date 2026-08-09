export const site = {
  title: 'Susurrium | 个人主页',
  shortTitle: 'Susurrium',
  description: 'Susurrium 的个人主页，记录软件工程、数据分析、项目实践与长期写作。',
  url: 'https://susurrium.github.io/homepage/',
  author: 'Susurrium',
  location: null as string | null,
  email: null as string | null,
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
    { label: 'GitHub', href: 'https://github.com/Susurrium', icon: 'github' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' }
  ],
  profile: {
    headline: '构建、分析，也长期写作',
    summary:
      '围绕软件工程、数据分析与知识管理持续实践，在这里整理项目、技术笔记和阶段性成果。',
    keywords: ['Astro', 'TypeScript', '数据分析', '产品思维', '写作'],
    availability: '持续构建 · 公开记录 · 欢迎交流'
  },
  education: [] as Array<{
    school: string;
    degree: string;
    period: string;
    detail: string;
  }>,
  experience: [
    {
      title: '个人主页与博客系统',
      org: '开源项目',
      period: '持续维护',
      detail: '使用 Astro、Markdown 内容集合与 Pagefind 构建可持续维护的静态个人站。'
    },
    {
      title: '数据分析与可视化实践',
      org: '个人项目',
      period: '持续整理',
      detail: '沉淀数据处理、指标设计、图表表达与项目复盘方法。'
    }
  ],
  skills: [
    {
      group: '工程',
      items: ['TypeScript', 'Astro', 'Node.js', 'Git']
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
