/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	AI: Ai;
}


const allowedOrigins =
['http://localhost:9000',
 'https://esl.alearn.org.tw'
];

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {

		const corsHeaders = {
			'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0],
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		}

		// 如果路徑是 /api/v1/dialog，則返回對話結果
		if (request.url.includes('/api/v1/dialog')) {

			const messages = [
				{ role: "system", content: "You are a friendly assistant" },
				{
				  role: "user",
				  content: "What is the origin of the phrase Hello, World",
				},
			];
			const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast" as keyof AiModels, {
				messages
			});

			return new Response(
				JSON.parse(JSON.stringify(response)).response,
				{
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
					status: 200,
				}
			);
		}



		return new Response('Hello World!', { headers: corsHeaders });
	},
} satisfies ExportedHandler<Env>;
