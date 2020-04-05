function isArray(a) {
	return !!a && a.constructor === Array;
}

function isObject(o) {
	return !!o && o.constructor === Object;
}

function chunkArray(a, limit = 0) {
	if (!isArray(a)) throw new Error('Provide an array');
	const _a = [],
		chunks = Math.ceil(a.length / limit);

	if (chunks === 1 || limit === 0) return [a];

	for (let i = 0; i < chunks; i++) {
		_a.push(a.slice(i * limit, i * limit + limit));
	}
	return _a;
}

module.exports = {
	isArray,
	isObject,
	chunkArray
};
