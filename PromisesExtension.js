module.exports = class PromiseV2 extends Promise {
	constructor(parameters) {
		super(parameters);
	}

	static async props(object) {
		return Object.assign(
			{},
			...(await Promise.all(
				Object.entries(object).map(async ([key, value]) => ({
					[key]: await value,
				}))
			))
		);
	}

	static async map(array) {}
};
