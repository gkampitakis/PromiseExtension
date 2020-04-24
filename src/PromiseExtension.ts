import { chunkArray, isObject } from './utils';

export default class PromiseExtension {
	static async props<T>(object: T): Promise<T> {
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

	static async map<T>(
		array: Array<T>,
		callback: (param: T, index?: number) => any,
		{ concurrency }: { concurrency: number } = { concurrency: 1 }
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const r: any[] = [],
				iterable = chunkArray(array, concurrency);

			for (let i = 0; i < iterable.length; i++) {
				const p = iterable[i].map(callback);

				try {
					const result: any = await Promise.all(p);
					r.push(...result);
				} catch (error) {
					reject(error);
				}
			}
			resolve(r);
		});
	}
}
