import { generateThemeCss } from "../theme-generator.js";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const hexColor = url.searchParams.get('color') || '6750A4';
  const isDark = url.searchParams.get('dark') === 'true';

  const cssText = generateThemeCss(hexColor, isDark);

  return new Response(JSON.stringify({ css: cssText }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=31536000",
    }
  });
}
