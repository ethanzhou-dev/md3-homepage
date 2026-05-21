export async function onRequest(context) {
  const { request } = context;
  const urlObj = new URL(request.url);
  let targetUrlParam = urlObj.searchParams.get("url");
  if (!targetUrlParam) {
    return new Response("Missing url parameter", { status: 400 });
  }

  if (!/^https?:\/\//i.test(targetUrlParam)) {
    targetUrlParam = "https://" + targetUrlParam;
  }

  let targetUrl;
  try {
    targetUrl = new URL(targetUrlParam);
  } catch (e) {
    return new Response("Invalid url", { status: 400 });
  }

  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  
  let cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  let faviconUrl = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(targetUrl.origin, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      let foundHref = null;
      await new HTMLRewriter()
        .on("link[rel*='icon']", {
          element(element) {
            const href = element.getAttribute("href");
            const rel = element.getAttribute("rel");
            if (href) {
              if (!foundHref || rel.includes("apple-touch-icon") || rel.includes("shortcut")) {
                foundHref = href;
              }
            }
          }
        })
        .transform(response)
        .text();

      if (foundHref) {
        if (foundHref.startsWith("//")) {
          faviconUrl = "https:" + foundHref;
        } else if (foundHref.startsWith("/")) {
          faviconUrl = targetUrl.origin + foundHref;
        } else if (/^https?:\/\//i.test(foundHref)) {
          faviconUrl = foundHref;
        } else {
          faviconUrl = targetUrl.origin + "/" + foundHref;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing HTML for favicon:", e);
  }

  if (!faviconUrl) {
    faviconUrl = targetUrl.origin + "/favicon.ico";
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const iconRes = await fetch(faviconUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (iconRes.ok) {
      const contentType = iconRes.headers.get("Content-Type");
      const body = await iconRes.arrayBuffer();
      
      const finalResponse = new Response(body, {
        headers: {
          "Content-Type": contentType || "image/x-icon",
          "Cache-Control": "public, max-age=604800",
        }
      });
      context.waitUntil(cache.put(cacheKey, finalResponse.clone()));
      return finalResponse;
    }
  } catch (e) {
    console.error("Error fetching favicon directly:", e);
  }

  try {
    const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${targetUrl.hostname}`;
    const iconRes = await fetch(googleFaviconUrl);
    if (iconRes.ok) {
      const contentType = iconRes.headers.get("Content-Type");
      const body = await iconRes.arrayBuffer();
      
      const finalResponse = new Response(body, {
        headers: {
          "Content-Type": contentType || "image/png",
          "Cache-Control": "public, max-age=604800",
        }
      });
      context.waitUntil(cache.put(cacheKey, finalResponse.clone()));
      return finalResponse;
    }
  } catch (e) {
    console.error("Error fetching fallback google favicon:", e);
  }

  const letter = targetUrl.hostname.replace("www.", "")[0].toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="20" fill="#6750A4"/>
      <text x="20" y="26" font-family="Roboto, Arial, sans-serif" font-size="18" font-weight="500" fill="#FFFFFF" text-anchor="middle">${letter}</text>
    </svg>
  `;
  const finalResponse = new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    }
  });
  return finalResponse;
}
