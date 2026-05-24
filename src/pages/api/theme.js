import { generateThemeCss } from "../../utils/theme-generator.js";

export async function GET({ request }) {
  const url = new URL(request.url);
  
  const hexColor = url.searchParams.get('color') || '6750A4';

  const lightCss = generateThemeCss(hexColor, false);
  const darkCss = generateThemeCss(hexColor, true);
  const combinedCss = `:root { ${lightCss} } @media (prefers-color-scheme: dark) { :root:not(.light-theme) { ${darkCss} } } :root.dark-theme { ${darkCss} }`;

  return new Response(combinedCss, {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=31536000",
    }
  });
}
