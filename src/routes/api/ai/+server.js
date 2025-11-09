import { json } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export async function POST({ request }) {
	const { prompt } = await request.json();

	try {
		const res = await fetch(`${PUBLIC_API_URL}/api/ai/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt })
		});

		const data = await res.json();

		return json(data);
	} catch (err) {
		console.error('[Frontend API Error]', err);
		return json({ error: 'Failed to reach Gemini API' }, { status: 500 });
	}
}