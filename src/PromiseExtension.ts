import { chunkArray, isObject } from './utils';

async function props<T>(object: T): Promise<T> {
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

async function map<T>(
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
			} catch (e) {
				reject(e);
			}
		}
		resolve(r);
	});
}

async function each<T>(array: Array<T>, callback: (param: T, index?: number, length?: number) => any): Promise<any> {
	return new Promise(async (resolve, reject) => {
		const r: any = [];
		try {
			for (let i = 0; i < array.length; i++) {
				const v = await array[i];
				await callback(v, i, array.length);
				r.push(v);
			}
			resolve(r);
		} catch (e) {
			reject(e);
		}
	});
}

async function delay(timer: number, callback?: Function) {
	return new Promise((resolve) => setTimeout(() => resolve(callback ? callback() : undefined), timer));
}

export default {
	map,
	props,
	each,
	delay
};
