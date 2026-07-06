// vitepress-plugin-mermaid renders Mermaid via a Vue component (SSG-friendly),
// so no runtime hook is needed here. This file just extends the default theme
// with our custom CSS.
import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  extends: DefaultTheme,
};
