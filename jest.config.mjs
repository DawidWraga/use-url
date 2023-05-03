// jest.config.mjs
// import nextJest from 'next/jest.js';

const createJestConfig = (config) => config;

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
	// Add more setup options before each test is run
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	testEnvironment: 'jest-environment-jsdom',

	// // testEnvironment: 'node',
	preset: 'ts-jest',
	moduleNameMapper: {
		'^~/(.*)$': '<rootDir>/src/$1',
	},
	// setupFilesAfterEnv: ['./jest.setup.ts'],
	// moduleNameMapper: {
	// 	'^~/(.*)$': '<rootDir>/src/$1',
	// },
	// transform: {
	// 	'^.+\\.tsx?$': 'ts-jest',
	// },

	// testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	// moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
