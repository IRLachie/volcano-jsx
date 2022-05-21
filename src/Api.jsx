const API_URL_BASE = "http://sefdb02.qut.edu.au:3001";

export default async function makeApiRequestLoggedin(url, method, body) {
	const response = await fetch(API_URL_BASE + url, {
		method,
		body: body !== undefined ? body : null,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	if (!response.ok) return response.status.toString();

	return await response.json();
}

export async function makeApiRequest(url, method, body) {
	const response = await fetch(API_URL_BASE + url, {
		method,
		body: body !== undefined ? body : null,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) return response.status.toString();

	return await response.json();
}
