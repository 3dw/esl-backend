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

interface DialogRequest {
	topic: string;
	history: string[];
	prompt: string;
}

interface DialogResponse {
	topic: string;
	response: string;
}

const allowedOrigins = [
	'http://localhost:9000',
	'https://esl.alearn.org.tw'
];

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin');

		const corsHeaders = {
			'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? (origin || allowedOrigins[0]) : allowedOrigins[0],
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		}

		// 處理 OPTIONS 請求（CORS preflight）
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders,
				status: 200,
			});
		}

		// 如果路徑是 /api/v1/dialog，則處理對話請求
		if (url.pathname === '/api/v1/dialog') {
			if (request.method === 'POST') {
				try {
					// 解析請求 body
					const body: DialogRequest = await request.json();
					const { topic, history, prompt } = body;

					// 驗證必要欄位
					if (!topic || !prompt) {
						return new Response(
							JSON.stringify({ error: 'topic 和 prompt 是必要欄位' }),
							{
								headers: {
									'Content-Type': 'application/json',
									...corsHeaders,
								},
								status: 400,
							}
						);
					}

					// 構建對話訊息
					const messages = [
						{
							role: "system",
							content: `你是一個英文學習助理，專門幫助學習者在「${topic}」情境下練習英文對話。請用繁體中文回答，並提供實用的英文表達。`
						}
					];

					// 如果有歷史對話，加入到 messages 中
					if (history && history.length > 0) {
						history.forEach(historyItem => {
							messages.push({ role: "user", content: historyItem });
						});
					}

					// 加入當前的問題
					messages.push({ role: "user", content: prompt });

					// 呼叫 AI 服務
					const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast" as keyof AiModels, {
						messages
					});

					// 構建回應格式
					const dialogResponse: DialogResponse = {
						topic: topic,
						response: JSON.parse(JSON.stringify(response)).response
					};

					return new Response(
						JSON.stringify(dialogResponse),
						{
							headers: {
								'Content-Type': 'application/json',
								...corsHeaders,
							},
							status: 200,
						}
					);

				} catch (error) {
					return new Response(
						JSON.stringify({ error: '請求格式錯誤或處理失敗' }),
						{
							headers: {
								'Content-Type': 'application/json',
								...corsHeaders,
							},
							status: 400,
						}
					);
				}
			} else {
				// 如果不是 POST 請求
				return new Response(
					JSON.stringify({ error: '僅支援 POST 請求' }),
					{
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders,
						},
						status: 405,
					}
				);
			}
		}

		// 預設回應
		return new Response('Hello World!', { headers: corsHeaders });
	},
} satisfies ExportedHandler<Env>;
