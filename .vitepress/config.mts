import { defineConfig } from 'vitepress';
import { gstackSidebar, bmadSidebar, deerflowSidebar } from './sidebars.mts';

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

// Escape prose that Vue's template compiler would otherwise mis-parse:
//   1. Bare pseudo-tags like `D<N>.k`, `<slug>`, `<CVE-ID>`, `<PPID>` — Vue treats them as unclosed HTML tags.
//   2. `{{PLACEHOLDER}}` sequences — Vue treats them as interpolation expressions,
//      even inside <code> or <pre> (interpolation is a template-compiler pass, not HTML-scoped).
// Both patterns appear widely in the books.
//   - <TAG>: only escape in inline text tokens (safe — code spans render <TAG> as literal).
//   - {{...}}: escape EVERYWHERE it can appear — text tokens, code_inline, code_block, fence.
//     Because Vue re-parses the compiled template, `<code>{{X}}</code>` still triggers interpolation.
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
      // Escape {{...}} in fenced/indented code blocks (they render as <pre><code>...</code></pre>).
      if ((blockToken.type === 'fence' || blockToken.type === 'code_block') && blockToken.content) {
        blockToken.content = escapeInterp(blockToken.content);
        continue;
      }
      if (blockToken.type !== 'inline' || !blockToken.children) continue;
      for (const tok of blockToken.children) {
        // Text tokens: escape both <TAG> and {{...}}.
        if (tok.type === 'text' && tok.content) {
          if (TAG_RE.test(tok.content)) {
            TAG_RE.lastIndex = 0;
            tok.content = tok.content.replace(TAG_RE, '&lt;$1&gt;');
          }
          tok.content = escapeInterp(tok.content);
        }
        // Inline code (backtick-spans): only {{...}} needs escaping — <TAG> renders literally.
        if (tok.type === 'code_inline' && tok.content) {
          tok.content = escapeInterp(tok.content);
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
});
