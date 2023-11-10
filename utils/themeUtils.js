import { enableCSSRulesBySelector, disableCSSRulesBySelector } from './cssUtils.js';

export function setTheme(theme) {
  if (theme == "light") {
    document.documentElement.style.setProperty("--background-color", "transparent");
    document.documentElement.style.setProperty("--text-color", "#000000");
    document.documentElement.style.setProperty("--placeholder-color", "#8e8ea0");
    document.documentElement.style.setProperty("--button-color", "#d3d3d3");
    document.documentElement.style.setProperty("--button-hover-color", "#828282");
    document.documentElement.style.setProperty("--button-text-color", "#fff");
    document.documentElement.style.setProperty("--stats-text-color", "#767676");
    document.documentElement.style.setProperty("--info-text-color", "#cccccc");
    document.documentElement.style.setProperty("--border-color", "#ccc");
    document.documentElement.style.setProperty("--border-shadow-color", "rgba(139, 139, 139, 0.4)");
    document.documentElement.style.setProperty("--code-block-background-color", "#f6f6f6");
    document.documentElement.style.setProperty("--code-block-text-color", "#000000");
    document.documentElement.style.setProperty("--inline-code-background-color", "#f6f6f6");
    document.documentElement.style.setProperty("--inline-code-text-color", "#e01e5a");
    document.documentElement.style.setProperty("--dot-color", "#8e8ea0");
    document.documentElement.style.setProperty("--dot-hover-color", "#000000");
    document.documentElement.style.setProperty("--sub-text-color", "#767676");
    document.documentElement.style.setProperty("--container-background-color", "rgba(235, 235, 235, 0.4)");
    document.documentElement.style.setProperty("--strong-text-background-color", "rgba(255, 255, 51, 0.4)");
    document.documentElement.style.setProperty("--underline-text-background-color", "transparent");
    document.documentElement.style.setProperty("--underline-text-color", "#0645AD");
  }

  if (theme == "dark") {
    document.documentElement.style.setProperty("--background-color", "#000000");
    document.documentElement.style.setProperty("--text-color", "#00f700");
    document.documentElement.style.setProperty("--placeholder-color", "#007000");
    document.documentElement.style.setProperty("--button-color", "#001400");
    document.documentElement.style.setProperty("--button-hover-color", "#001f00");
    document.documentElement.style.setProperty("--button-text-color", "#007000");
    document.documentElement.style.setProperty("--stats-text-color", "#007000");
    document.documentElement.style.setProperty("--info-text-color", "#007000");
    document.documentElement.style.setProperty("--border-color", "rgba(0, 112, 0, 0.4)");
    document.documentElement.style.setProperty("--border-shadow-color", "rgba(0, 112, 0, 0.6)");
    document.documentElement.style.setProperty("--code-block-background-color", "#001f00");
    document.documentElement.style.setProperty("--code-block-text-color", "#00f700");
    document.documentElement.style.setProperty("--inline-code-background-color", "#001f00");
    document.documentElement.style.setProperty("--inline-code-text-color", "#00f700");
    document.documentElement.style.setProperty("--dot-color", "#007000");
    document.documentElement.style.setProperty("--dot-hover-color", "#00f700");
    document.documentElement.style.setProperty("--sub-text-color", "#007000");
    document.documentElement.style.setProperty("--container-background-color", "rgba(0, 70, 0, 0.3)");
    document.documentElement.style.setProperty("--strong-text-background-color", "rgba(0, 112, 0, 0.5)");
    document.documentElement.style.setProperty("--underline-text-background-color", "transparent");
    document.documentElement.style.setProperty("--underline-text-color", "#00f700");
  }

  // Code highlighting styles
  if (theme == "light") {
    require('highlight.js/styles/github.css');
    enableCSSRulesBySelector('.hljs');
  }
  
  if (theme == "dark") {
    disableCSSRulesBySelector('.hljs');
  }
}
