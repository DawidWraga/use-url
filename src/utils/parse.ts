/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { isArray, isObject } from '@chakra-ui/utils';
import qs from 'qs';
export const parse = (
	str: string,
	options?: qs.IParseOptions & {
		decoder?: undefined;
	}
): qs.ParsedQs => {
	//
	return parseValue(
		qs.parse(str, {
			// default is 20, causes errors when parsing arrays with more than 20 items
			arrayLimit: 100,
			...options,
		})
	);
};

function isNumber(val: any): val is number {
	return !isNaN(parseFloat(val)) && isFinite(val);
}

function isBoolean(val: any): val is boolean {
	return val === 'false' || val === 'true';
}

export function parseValue(val: any): any {
	if (typeof val == 'undefined' || val == '') {
		return null;
	} else if (isBoolean(val)) {
		return parseBoolean(val);
	} else if (isArray(val)) {
		return parseArray(val);
	} else if (isObject(val)) {
		return parseObject(val);
	} else if (isNumber(val)) {
		return parseNumber(val);
	} else {
		return val;
	}
}

export function parseObject(obj: object): object {
	const result: { [key: string]: any } = {};
	for (const key in obj) {
		// @ts-expect-error not sure
		let val = obj[key];

		// handle date strings
		const isPossiblyDate =
			(typeof val === 'string' && val.length > 0 && key.includes('At')) ||
			key.includes('Date');

		if (isPossiblyDate) {
			const possibleDate = new Date(val);
			const isValidDate =
				possibleDate instanceof Date && !isNaN(possibleDate.getTime());

			if (isValidDate) val = possibleDate;
			else val = parseValue(val);
		}

		// handle all other
		if (!isPossiblyDate) val = parseValue(val);

		if (val !== null) result[key] = val; // ignore null values
	}
	return result;
}

function parseArray(arr: any[]): any[] {
	const result: any[] = [];
	for (let i = 0; i < arr.length; i++) {
		result[i] = parseValue(arr[i]);
	}
	return result;
}

function parseNumber(val: any): number {
	return Number(val);
}

function parseBoolean(val: any): boolean {
	return val === 'true';
}
