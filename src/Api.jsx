const API_URL_BASE = 'http://sefdb02.qut.edu.au:3001';

export default async function makeApiRequest(url, method, body, token) {
	const response = await fetch(API_URL_BASE + url, {
		method,
		body: body !== undefined ? body : null,
		headers: {
			accept: 'application/json',
			authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) throw new Error(response.status.toString());

	return await response.json();
}
