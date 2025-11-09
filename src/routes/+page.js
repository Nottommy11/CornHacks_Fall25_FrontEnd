export async function load({ fetch }) {
	const res = await fetch('/api/nodes');
	const nodes = await res.json();
	return { nodes };
}
