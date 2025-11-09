import { PUBLIC_API_URL } from '$env/static/public';

export async function GET() {
	const res = await fetch(`${PUBLIC_API_URL}/api/nodeData`);
    //console.log(res);
	const data = await res.json();
    //console.log(data);
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
}