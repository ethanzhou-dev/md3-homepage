export async function onRequest(context) {
  const { env } = context;

  const launchDate = new Date(2026, 2, 26, 0, 0);
  const now = new Date();
  const diff = now - launchDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  let visitors = 0;
  
  if (env.STATS_KV) {
    const countStr = await env.STATS_KV.get("site_visitors");
    visitors = countStr ? parseInt(countStr) + 1 : 1;
    
    context.waitUntil(env.STATS_KV.put("site_visitors", visitors.toString()));
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
