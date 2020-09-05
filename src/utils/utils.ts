function isArray(a): boolean {
	return !!a && a.constructor === Array;
}

function isObject(o): boolean {
	return !!o && o.constructor === Object;
}

function chunkArray<T>(a: T[], limit = 0) {
	if (!isArray(a)) throw new Error('Provide an array');
	const _a: Array<Array<T>> = [],
		chunks = Math.ceil(a.length / limit);

	if (chunks < 2 || limit === 0) return [a];

	for (let i = 0; i < chunks; i++) {
		_a.push(a.slice(i * limit, i * limit + limit));
	}
	return _a;
}

export { isArray, isObject, chunkArray };
