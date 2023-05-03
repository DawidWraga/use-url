/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { runIfFn } from '@chakra-ui/utils';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { type Params } from '~/types/params';
import { parse } from '~/utils/parse';
import { stringify } from '~/utils/stringify';

export interface UseUrlProps {}

export function useUrl<TParams extends Params = Params>(
	props: UseUrlProps = {}
) {
	type TPartialParams = Partial<TParams>;

	const {} = props;
	const router = useRouter();

	// ======= GET DATA FROM URL =======

	const emptyUrlData = {
		basePath: '',
		params: {} as TPartialParams,
	};

	const urlData = useMemo(() => {
		if (!router.isReady || !router.asPath) return emptyUrlData;
		const basePath = router.asPath.split('?')[0]?.split('#')[0];
		// const basePath = router.asPath.split("?").slice(1).join("").split("#")[0];
		// remove hash from url allows for id to be passed in url, e.g. /assets?a=1#card-id-5
		if (!basePath) return emptyUrlData;

		const pathWithoutBase = router.asPath.replace(basePath + '?', '');

		const params = parse(pathWithoutBase) as TPartialParams;
		return { basePath, params };
	}, [router.asPath, router.isReady]);

	// must group these together as they are dependent on each other
	// also, if destructured, they will cause name conflict issues in getUrlString
	const { params, basePath } = urlData;

	// ======= UPDATE URL  =======

	/**
	 * Returns url string with new params
	 */
	const getUrlString = useCallback(
		(options: {
			/**
			 * params object to add to url
			 * @default current params
			 */
			params?: TPartialParams;
			/**
			 * pathname to add params to
			 * @default current pathname (router.asPath)
			 * @example '/assets'
			 */
			basePath?: string;
		}) => {
			const { params = urlData.params, basePath = urlData.basePath } = options;
			const paramsString = stringify(params);
			const newPath = `${basePath}${paramsString ? '?' : ''}${paramsString}`;
			// console.log({ urlData, params, basePath, newPath, paramsString });
			return newPath;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[basePath, params]
	);

	/**
	 * Changes entire url params
	 *
	 * @param newParams - new params object or function which accepts previous params as arguement and returns new params object
	 * @returns new url string
	 *
	 */

	const setParams = useCallback(
		(
			newParams: TPartialParams | ((params: TPartialParams) => TPartialParams)
		) => {
			const newParamsObject = runIfFn(newParams, { ...params });
			const url = getUrlString({ params: newParamsObject });
			router.push(url, undefined, {
				//!! IMPORTANT CONFIG:
				// if using `shallow: true`, getServerSideProps will not rerun on params change
				// ok to use if using useQuery instead of getServerSideProps
				scroll: false,
				shallow: true,
			});
			return url;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[basePath, params]
	);

	/**
	 * Changes ONE param in url params object
	 *
	 * @param key - key of param to change
	 * @param value - new value of param or function which accepts previous param value as argument and returns new param value
	 * @returns new url string
	 *
	 */
	const setParam = useCallback(
		<TParam extends keyof TPartialParams>(
			key: TParam,
			value:
				| null
				| TPartialParams[TParam]
				| ((param: TPartialParams[TParam]) => TPartialParams[TParam])
		) => {
			return setParams((prev) => {
				const prevParam = prev[key];
				const newParam = runIfFn(value, prevParam);

				return {
					...prev,
					[key]: newParam,
				};
			});
		},
		[setParams]
	);

	// ============== DYNAMIC PATH ==============

	const getDynamicPathData = useCallback(
		<T = string,>(key = 'id'): T | undefined => {
			const query = router.query;
			const value = query[key];

			if (!value) return;

			if (isNumeric(value)) {
				return Number(value) as T;
			}
			return value as T;
		},
		[router.query]
	);

	return {
		params,
		setParams,
		setParam,
		getUrlString,
		getDynamicPathData,
		isReady: router.isReady,
		basePath,
		router,
		parse,
		stringify,
	};
}

const isNumeric = (n: any) => n && !isNaN(n);
