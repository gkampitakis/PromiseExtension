import { chunkArray, isObject } from './utils';

async function props<T>(object: T): Promise<T> {
	if (!isObject(object)) return new Promise((resolve) => resolve());
	return Object.assign(
		{},
		...(await Promise.all(
			Object.entries(object).map(async ([key, value]) => {
				if (Object.entries(object[key]).length > 0) return { [key]: await props(object[key]) };
				return { [key]: await value };
			})
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

async function delay(timer: number, order: boolean, callback: Function): Promise<any>;
async function delay(timer: number, callback?: Function): Promise<any>;
async function delay(timer: number): Promise<any>;

async function delay(timer: any, order?: any, callback?: any) {
	const fn = typeof order === 'function' ? order : callback;
	const o = typeof order === 'boolean' ? order : false;

	return o
		? new Promise(async (resolve, reject) => {
				try {
					const r = await fn();
					setTimeout(() => resolve(r), timer);
				} catch (e) {
					reject(e);
				}
		  })
		: new Promise((resolve) => setTimeout(() => resolve(fn ? fn() : undefined), timer));
}

export default {
	map,
	props,
	each,
	delay
};
