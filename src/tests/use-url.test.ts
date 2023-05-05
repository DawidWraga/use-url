/* eslint-disable @typescript-eslint/no-unsafe-call */
import { renderHook } from '@testing-library/react';
import { useUrl } from '../use-url';
import { stringify } from '../utils/stringify';

// Mocking useRouter so that we can test useUrl without Next.js
jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '',
			pathname: '',
			query: '',
			asPath: '',
			isReady: true,
			push: jest.fn(),
		};
	},
}));

const defaults = {
	shallow: true,
	scroll: false,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('useUrl hook', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should have empty default params', () => {
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.params).toEqual({});
	});

	it('params should parse type: string', () => {
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?name=Jane',
			asPath: '/home?name=Jane',
			query: { name: 'Jane' },
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual({ name: 'Jane' });
	});

	it('params should parse type: number', () => {
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?age=30',
			asPath: '/home?age=30',
			query: { age: '30' },
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual({ age: 30 });
	});

	it('params should parse type: boolean', () => {
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?active=true',
			asPath: '/home?active=true',
			query: { active: 'true' },
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual({ active: true });
	});

	it('params should parse type: date', () => {
		const dateString = '2022-01-01';
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: `/home?someDate=${dateString}`,
			asPath: `/home?someDate=${dateString}`,
			query: { someDate: dateString },
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual({ someDate: new Date(dateString) });
	});

	it('params should parse type: array', () => {
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?nums[0]=1&nums[1]=2&nums[2]=3',
			asPath: '/home?nums[0]=1&nums[1]=2&nums[2]=3',
			query: { numbers: '1,2,3' }, //<- todo: fix this (next router will have different results but query not used right now anyway so don't care)
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual({ nums: [1, 2, 3] });
	});

	it('params should parse type: object', () => {
		const object = {
			data: {
				prop1: 'value1',
				prop2: 'value2',
			},
		};
		const encodedObject = stringify(object);

		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: `/home?${encodedObject}`,
			asPath: `/home?${encodedObject}`,
			query: { data: encodedObject }, //<- todo fix this (wrong, but dont care)
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual(object);
	});

	it('params should parse type: nested object', () => {
		const nestedObject = {
			nestedData: {
				prop1: {
					nestedProp1: 'value1',
					nestedProp2: 'value2',
				},
				prop2: {
					nestedProp3: 'value3',
					nestedProp4: 'value4',
				},
			},
		};
		const encodedNestedObject = stringify(nestedObject);

		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: `/home?${encodedNestedObject}`,
			asPath: `/home?${encodedNestedObject}`,
			query: nestedObject,
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual(nestedObject);
	});

	it('params should parse type: array of objects', () => {
		const arrayOfObjects = {
			people: [
				{ name: 'John', age: 30 },
				{ name: 'Jane', age: 28 },
			],
		};
		const encodedArrayOfObjects = stringify(arrayOfObjects);

		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: `/home?${encodedArrayOfObjects}`,
			asPath: `/home?${encodedArrayOfObjects}`,
			query: arrayOfObjects,
		}));
		const { result } = renderHook(() => useUrl<any>());
		expect(result.current.basePath).toEqual('/home');
		expect(result.current.params).toEqual(arrayOfObjects);
	});

	it('should return a url string with updated params', () => {
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?name=John',
			asPath: '/home?name=John',
			query: { name: 'John' },
		}));
		const { result } = renderHook(() => useUrl<any>());
		const updatedUrl = result.current.getUrlString({
			params: { name: 'Jane', age: 28 },
		});
		expect(updatedUrl).toEqual('/home?name=Jane&age=28');
	});

	it('should update the entire params object', () => {
		const push = jest.fn();

		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?name=John',
			asPath: '/home?name=John',
			query: { name: 'John' },
			push,
		}));
		const { result } = renderHook(() => useUrl<any>());
		result.current.setParams({ name: 'Jane', age: 28 });
		expect(push).toHaveBeenCalledWith(
			'/home?name=Jane&age=28',
			undefined,
			defaults
		);
	});

	it('should update a single param', () => {
		const push = jest.fn();

		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home?name=John',
			asPath: '/home?name=John',
			query: { name: 'John' },
			push,
		}));
		const { result } = renderHook(() => useUrl<any>());
		result.current.setParam('name', 'Jane');
		expect(push).toHaveBeenCalledWith('/home?name=Jane', undefined, defaults);
	});

	it('should return data from dynamic path', () => {
		useRouter.mockImplementation(() => ({
			isReady: true,
			pathname: '/home/42',
			asPath: '/home/42',
			query: { id: '42' },
		}));
		const { result } = renderHook(() => useUrl<any>());
		const dynamicData = result.current.getDynamicPathData('id');
		expect(dynamicData).toEqual(42);
	});
});
