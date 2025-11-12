export async function load({ fetch }) {
	const res = await fetch('/api/nodeData');
	const nodeData = await res.json();
	return { nodeData };
}