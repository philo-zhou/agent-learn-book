import DefaultTheme from 'vitepress/theme';
import './custom.css';
import { setupMermaidZoom } from './mermaid-zoom';

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === 'undefined') return;
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', setupMermaidZoom, { once: true });
    } else {
      setupMermaidZoom();
    }
  },
};
