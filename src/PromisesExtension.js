const { isObject } = require('./utils');

module.exports = class PromiseV2 extends Promise {
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

	static async map(array) {}
};
