import { getStatsData } from "../stats-core.js";

export async function onRequest(context) {
  const { request, env } = context;

  const responseData = await getStatsData(request, env, context);

  return new Response(JSON.stringify(responseData), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    }
  });
}

