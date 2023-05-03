import { format, isDate } from 'date-fns';
import qs from 'qs';
import { filterNullObjectValues } from '~/utils/filter-null-object-values';

export interface StringifyOptions extends qs.IStringifyOptions {
	filterNull?: boolean;
}

export const stringify = (obj: any, options: StringifyOptions = {}) => {
	const { filterNull, ...qsOptions } = options;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const processedObj = filterNull ? filterNullObjectValues(obj) : obj;

	return qs.stringify(processedObj, {
		/**
		 * using array format 'repeat' or `incicies`: false will result in arrays of objects being serialised as multiple separate arrays
		 * eg (id: [1,2], name: [a,b])
		 * instead of [{id: 1, name: a}, {id: 2, name: b}]
		 */
		// indices: false,
		// arrayFormat: '',
		encode: false,
		encodeValuesOnly: true,
		serializeDate: (date) => {
			// must use mm-dd-yyyy format for new Date() to work
			// if using dd-mm-yyyy, new Date() will return invalid date
			return isDate(date) ? format(date, 'MM-dd-yyyy') : '';
		},
		...qsOptions,
	});
};
