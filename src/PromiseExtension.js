const { isObject, chunkArray } = require('./utils');

module.exports = class PromiseExtension extends Promise {
	constructor(parameters) {
		super(parameters);
	}

	static async props(object) {
		if (!isObject(object)) throw new Error('Promise.props only accepts object');
		return Object.assign(
			{},
			...(await Promise.all(
				Object.entries(object).map(async ([key, value]) => ({
					[key]: await value
				}))
			))
		);
	}

	static async map(array, callback, { concurrency } = {}) {
		return new Promise(async (resolve, reject) => {
			const r = [];
			array = chunkArray(array, concurrency);

			for (let i = 0; i < array.length; i++) {
				const p = array[i].map(callback);

				try {
					const result = await Promise.all(p);
					r.push(...result);
				} catch (error) {
					reject(error);
				}
			}
			resolve(r);
		});
	}
};
