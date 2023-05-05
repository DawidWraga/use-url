/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { isArray, isObject } from '@chakra-ui/utils';
import { mapObject } from './map-object';

export function filterNullObjectValues<T extends Record<any, any>>(
	obj: T
): Partial<T> {
	let newObj = { ...obj };

	newObj = mapObject(newObj, (key, value) => {
		if (isObject(value)) {
			return [key, filterNullObjectValues(value)];
		}
		if (isArray(value)) {
			return [key, value.filter((item: any) => item !== null)];
		}

		return value;
	});

	const filtered = Object.fromEntries(
		Object.entries(newObj).filter(([_key, value]) => {
			//handle objects
			if (isObject(value)) {
				return Object.keys(value).length > 0;
			}

			//handle array
			if (isArray(value)) {
				return value.length > 0;
			}

			// handle null
			return value !== null;
		})
	) as Partial<T>;

	return filtered;
}
