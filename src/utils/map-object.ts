import { isArray } from '@chakra-ui/utils';
export type ObjectKey = string | number | symbol;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<ObjectKey, any>;
/**
 *
 * Helper function for mapping over an object
 *
 * if function returns an array, it will be used as the new key/value pair
 * if function returns a value, it will be used as the new value
 *
 * @example
 * ```ts

const obj = { a: 1, b: 2, c: 3 };
const doubledValues = mapObject(obj, (k,v) => v * 2);
// { a: 2, b: 4, c: 6 }
const doubledValuesAndKeys = mapObject(obj, (k,v) => [k + k, v * 2]);
// { aa: 2, bb: 4, cc: 6 }

 * ```
 *
 * @param obj The object to map over
 * @param fn The function which will be called for each key/value pair in the object and should return a new value, or a new [key, value] pair
 * @returns
 */

export const mapObject = <
	TInputObject extends AnyObject,
	TOutputObject extends AnyObject = TInputObject,
	TInputKey = keyof TInputObject,
	TInputValue = TInputObject[keyof TInputObject],
	TOutputKey = keyof TOutputObject,
	TOutputValue = TOutputObject[keyof TOutputObject]
>(
	obj: TInputObject,
	fn: (
		/**
		 * The key of the current [key,value] pair
		 */
		key: TInputKey,
		/**
		 * The value of the current [key,value] pair
		 */
		value: TInputValue,
		/**
		 * The index of the current [key,value] pair
		 */
		index: number,
		/**
		 * The array of all [key,value] pairs
		 */
		array: [TInputKey, TInputValue]
	) => [TOutputKey, TOutputValue] | TOutputValue
) =>
	Object.fromEntries(
		Object.entries(obj).map(([k, v], i, array) => {
			const fnReturn = fn(
				k as TInputKey,
				v as TInputValue,
				i,
				array as [TInputKey, TInputValue]
			);

			if (isArray(fnReturn)) return fnReturn as [TOutputKey, TOutputValue];

			return [k, fnReturn] as [TOutputKey, TOutputValue];
		})
	) as TOutputObject;
