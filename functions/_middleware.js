import { generateThemeCss } from "./theme-generator.js";
import { getStatsData } from "./stats-core.js";

class ElementHandler {
  constructor(lang, theme) {
    this.lang = lang;
    this.theme = theme;
  }

  element(element) {
    if (this.lang) {
      element.setAttribute('lang', this.lang);
      const currentClass = element.getAttribute('class') || '';
      let newClass = currentClass
          .replace(/lang-\w+/g, '')
          .replace(/(dark-theme|light-theme)/g, '')
          .trim();
      
      newClass += ` lang-${this.lang}`;
      if (this.theme) {
        newClass += ` ${this.theme}-theme`;
      }
      element.setAttribute('class', newClass.trim());
    }
  }
}

class LangPrunerHandler {
  constructor(activeLang) {
    this.activeLang = activeLang;
  }

  element(element) {
    const nodeLang = element.getAttribute('data-lang');
    if (nodeLang && nodeLang !== this.activeLang) {
      element.remove();
    }
  }
}

class ThemeStyleHandler {
  constructor(cssText) {
    this.cssText = cssText;
  }

  element(element) {
    element.append(`<style id="dynamic-theme">${this.cssText}</style>`, { html: true });
  }
}

class ElementContentHandler {
  constructor(content) {
    this.content = content;
  }
  
  element(element) {
    element.setInnerContent(this.content);
  }
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  const response = await next();
  
  if (response.headers.get("content-type")?.includes("text/html")) {
    const cookies = request.headers.get("cookie") || "";
    let lang = 'en';
    let theme = null;
    let seedColor = '6750A4';

    if (cookies.includes('preferredLang=zh')) {
        lang = 'zh';
    } else if (cookies.includes('preferredLang=en')) {
        lang = 'en';
    } else {
        const acceptLang = request.headers.get('accept-language') || "";
        if (acceptLang.toLowerCase().includes('zh')) {
            lang = 'zh';
        }
    }

    if (cookies.includes('preferredTheme=dark')) {
        theme = 'dark';
    } else if (cookies.includes('preferredTheme=light')) {
        theme = 'light';
    }

    const colorMatch = cookies.match(/themeSeedColor=([^;]+)/);
    if (colorMatch) {
        seedColor = decodeURIComponent(colorMatch[1]);
    }

    const lightCss = generateThemeCss(seedColor, false);
    const darkCss = generateThemeCss(seedColor, true);
    const combinedCss = `:root { ${lightCss} } @media (prefers-color-scheme: dark) { :root:not(.light-theme) { ${darkCss} } } :root.dark-theme { ${darkCss} }`;
    
    // Fetch stats server-side
    const stats = await getStatsData(request, env, context);
    const uptimeText = `${stats.uptime.days} days, ${stats.uptime.hours} hrs`;
    const visitorsText = `${stats.visitors}`;

    return new HTMLRewriter()
      .on('html', new ElementHandler(lang, theme))
      .on('head', new ThemeStyleHandler(combinedCss))
      .on('[data-lang]', new LangPrunerHandler(lang))
      .on('.stat-uptime', new ElementContentHandler(uptimeText))
      .on('.stat-visitor', new ElementContentHandler(visitorsText))
      .transform(response);
  }

  return response;
}

