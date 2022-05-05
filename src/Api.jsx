const API_URL_BASE = "http://sefdb02.qut.edu.au:3001";

const token = localStorage.getItem("token");

export default async function makeApiRequest(url, method, body) {
	const response = await fetch(API_URL_BASE + url, {
		method,
		body: body !== undefined ? body : null,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
		cache: "force-cache",
	});

	if (!response.ok) return response.status.toString();

	return await response.json();
}
