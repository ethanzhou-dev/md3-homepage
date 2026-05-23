import { generateThemeCss } from "./theme-generator.js";

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
      
      newClass += ` lang-${this.lang} ${this.theme}-theme`;
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
    element.append(`<style id="dynamic-theme">:root{${this.cssText}}</style>`, { html: true });
  }
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  const response = await next();
  
  if (response.headers.get("content-type")?.includes("text/html")) {
    const cookies = request.headers.get("cookie") || "";
    let lang = 'en';
    let theme = 'light';
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
    } else {
        const prefersDark = request.headers.get('sec-ch-prefers-color-scheme') === 'dark';
        if (prefersDark) {
            theme = 'dark';
        }
    }

    const colorMatch = cookies.match(/themeSeedColor=([^;]+)/);
    if (colorMatch) {
        seedColor = decodeURIComponent(colorMatch[1]);
    }

    const themeCss = generateThemeCss(seedColor, theme === 'dark');

    return new HTMLRewriter()
      .on('html', new ElementHandler(lang, theme))
      .on('head', new ThemeStyleHandler(themeCss))
      .on('[data-lang]', new LangPrunerHandler(lang))
      .transform(response);
  }

  return response;
}

