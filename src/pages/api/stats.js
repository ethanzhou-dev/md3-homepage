import { getStatsData } from "../../utils/stats-core.js";

export async function GET({ request, locals }) {
  const env = locals.runtime.env;
  const context = locals.runtime.ctx;

  const responseData = await getStatsData(request, env, context);

  return new Response(JSON.stringify(responseData), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    }
  });
}

