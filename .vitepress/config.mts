import { defineConfig } from 'vitepress';
import { gstackSidebar, bmadSidebar } from './sidebars.mts';

// Fenced-code transformer: convert ```mermaid blocks into <div class="mermaid">...</div>
// The div is then picked up at runtime by the theme (see theme/index.ts).
function mermaidPlugin(md: any) {
  const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) || ((tokens: any, idx: number, options: any, env: any, self: any) => self.renderToken(tokens, idx, options));
  md.renderer.rules.fence = (tokens: any, idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx];
    const info = (token.info || '').trim();
    if (info === 'mermaid') {
      const code = token.content || '';
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<div class="mermaid">${escaped}</div>\n`;
    }
    return defaultFence(tokens, idx, options, env, self);
  };
}

// Escape bare pseudo-tags in inline prose. The books frequently write things like
// `D<N>.k`, `<slug>`, `<CVE-ID>`, `<PPID>` as placeholders. Outside code spans these
// look like unopened HTML tags to Vue's template compiler and break the build.
// We rewrite inline text tokens: <IDENTIFIER> → &lt;IDENTIFIER&gt;.
// Text INSIDE code_inline / code_block / fence tokens is untouched (markdown-it
// tokenizes them separately, so our text-token pass never sees them).
function escapeBarePseudoTags(md: any) {
  const RE = /<([A-Za-z][A-Za-z0-9._-]*)>/g;
  md.core.ruler.after('inline', 'escape-bare-pseudo-tags', (state: any) => {
    for (const blockToken of state.tokens) {
      if (blockToken.type !== 'inline' || !blockToken.children) continue;
      for (const tok of blockToken.children) {
        if (tok.type === 'text' && tok.content && RE.test(tok.content)) {
          RE.lastIndex = 0;
          tok.content = tok.content.replace(RE, '&lt;$1&gt;');
        }
      }
    }
  });
}

export default defineConfig({
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
      md.use(mermaidPlugin);
      md.use(escapeBarePseudoTags);
    },
  },
  // Disable Vue-style {{ }} interpolation in prose so the books' many `{{PLACEHOLDER}}`
  // references (skill resolvers, template placeholders) render as literal text.
  vue: {
    template: {
      compilerOptions: {
        delimiters: ['<!--{{-->', '<!--}}-->'],
      },
    },
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'gstack-book', link: '/gstack-book/' },
      { text: 'bmad-book', link: '/bmad-book/' },
      { text: 'GitHub', link: 'https://github.com/philo-zhou/agent-learn-book' },
    ],
    sidebar: {
      '/gstack-book/': gstackSidebar,
      '/bmad-book/': bmadSidebar,
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
});
