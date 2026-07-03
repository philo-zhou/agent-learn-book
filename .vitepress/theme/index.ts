import DefaultTheme from 'vitepress/theme';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import './custom.css';

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute();
    const renderMermaid = async () => {
      if (typeof window === 'undefined') return;
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
      await nextTick();
      const els = document.querySelectorAll('div.mermaid, pre.language-mermaid, code.language-mermaid');
      // Convert any un-rendered mermaid code blocks into divs and run mermaid
      const targets: HTMLElement[] = [];
      els.forEach(el => {
        if (el.tagName === 'DIV' && el.classList.contains('mermaid')) {
          targets.push(el as HTMLElement);
        } else if (el.tagName === 'PRE' || el.tagName === 'CODE') {
          const source = (el.textContent || '').trim();
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = source;
          (el.tagName === 'PRE' ? el : el.parentElement)?.replaceWith(div);
          targets.push(div);
        }
      });
      if (targets.length) await mermaid.run({ nodes: targets });
    };
    onMounted(() => { renderMermaid(); });
    watch(() => route.path, () => nextTick(renderMermaid));
  },
};
