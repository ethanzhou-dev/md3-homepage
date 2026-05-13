async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest(context) {
  const { request, env } = context;

  const launchDate = new Date(2026, 2, 26, 0, 0);
  const now = new Date();
  const diff = now - launchDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  let visitors = 0;
  
  if (env.STATS_KV) {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    
    const ipHash = await hashText(ip + "_salt_md3");
    const dedupKey = `visited_${ipHash}`;
    
    const countStr = await env.STATS_KV.get("site_visitors");
    visitors = countStr ? parseInt(countStr) : 0;
    
    const hasVisited = await env.STATS_KV.get(dedupKey);
    
    if (!hasVisited) {
      visitors += 1;
      
      context.waitUntil(Promise.all([
        env.STATS_KV.put("site_visitors", visitors.toString()),
        env.STATS_KV.put(dedupKey, "1", { expirationTtl: 86400 })
      ]));
    }
  } else {
    visitors = "KV未绑定";
  }

  const responseData = {
    uptime: { days, hours },
    visitors: visitors
  };

  return new Response(JSON.stringify(responseData), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    }
  });
}
