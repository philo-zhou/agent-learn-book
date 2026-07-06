import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { gstackSidebar, bmadSidebar, deerflowSidebar } from './sidebars.mts';

// Escape prose that Vue's template compiler would otherwise mis-parse:
//   1. Bare pseudo-tags like `D<N>.k`, `<slug>`, `<CVE-ID>`, `<PPID>` — Vue treats them as unclosed HTML tags.
//   2. `{{PLACEHOLDER}}` sequences — Vue treats them as interpolation expressions,
//      even inside <code> or <pre> (interpolation is a template-compiler pass, not HTML-scoped).
// Both patterns appear widely in the books.
//   - <TAG>: only escape in inline text tokens (safe — code spans render <TAG> as literal).
//   - {{...}}: escape EVERYWHERE it can appear — text tokens, code_inline, code_block, fence.
// VitePress theme templates that legitimately use `{{ site.title }}` etc. live in .vue files,
// not markdown, so they're untouched by this pass.
function escapeVueUnfriendlyProse(md: any) {
  const TAG_RE = /<([A-Za-z][A-Za-z0-9._-]*)>/g;
  const INTERP_RE = /\{\{([\s\S]*?)\}\}/g;
  const escapeInterp = (s: string) => {
    if (!INTERP_RE.test(s)) return s;
    INTERP_RE.lastIndex = 0;
    return s.replace(INTERP_RE, '&#123;&#123;$1&#125;&#125;');
  };
  md.core.ruler.after('inline', 'escape-vue-unfriendly-prose', (state: any) => {
    for (const blockToken of state.tokens) {
      if ((blockToken.type === 'fence' || blockToken.type === 'code_block') && blockToken.content) {
        // Do NOT touch mermaid fences — vitepress-plugin-mermaid needs raw source.
        if (blockToken.type === 'fence' && (blockToken.info || '').trim() === 'mermaid') continue;
        blockToken.content = escapeInterp(blockToken.content);
        continue;
      }
      if (blockToken.type !== 'inline' || !blockToken.children) continue;
      for (const tok of blockToken.children) {
        if (tok.type === 'text' && tok.content) {
          if (TAG_RE.test(tok.content)) {
            TAG_RE.lastIndex = 0;
            tok.content = tok.content.replace(TAG_RE, '&lt;$1&gt;');
          }
          tok.content = escapeInterp(tok.content);
        }
        if (tok.type === 'code_inline' && tok.content) {
          tok.content = escapeInterp(tok.content);
        }
      }
    }
  });
}

export default withMermaid(defineConfig({
  title: 'Agent Learn Book',
  description: '一个学习 AI agent 仓库的个人笔记本 —— 源码驱动、白盒路线、可验证的 file:line 指针',
  lang: 'zh-CN',
  base: '/agent-learn-book/',
  srcExclude: ['**/node_modules/**', '**/README.md'],
  ignoreDeadLinks: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/agent-learn-book/favicon.svg' }],
  ],
  markdown: {
    html: false,
    config: (md) => {
      // vitepress-plugin-mermaid injects its own fence handler for ```mermaid.
      // We only add the Vue-unfriendly-prose escaper on top.
      md.use(escapeVueUnfriendlyProse);
    },
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'gstack-book', link: '/gstack-book/' },
      { text: 'bmad-book', link: '/bmad-book/' },
      { text: 'deerflow-book', link: '/deerflow-book/' },
      { text: 'GitHub', link: 'https://github.com/philo-zhou/agent-learn-book' },
    ],
    sidebar: {
      '/gstack-book/': gstackSidebar,
      '/bmad-book/': bmadSidebar,
      '/deerflow-book/': deerflowSidebar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/philo-zhou/agent-learn-book' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索',
              },
              modal: {
                noResultsText: '无匹配结果',
                resetButtonTitle: '清除',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    footer: {
      message: 'CC BY-NC-SA 4.0',
      copyright: '© Philo Zhou · Source on GitHub',
    },
    outline: {
      level: [2, 3],
      label: '本页内容',
    },
    docFooter: {
      prev: '上一章',
      next: '下一章',
    },
    lastUpdated: {
      text: '最后更新',
    },
    editLink: {
      pattern: 'https://github.com/philo-zhou/agent-learn-book/edit/main/:path',
      text: '在 GitHub 上编辑本页',
    },
  },
}));
