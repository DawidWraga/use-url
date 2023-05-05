# useUrl hook for Next.js

[![NPM](https://img.shields.io/npm/v/@davstack/use-url?color=red)](https://www.npmjs.com/package/@davstack/use-url)
[![Continuous Integration](https://github.com/DawidWraga/use-url/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/DawidWraga/use-url/actions/workflows/publish.yml/)

A convenient wrapper around next router for setting & getting compound datatypes from URL query params

## Features

- 🌐 Simple global state management: the URL is the source of truth.
- 🔗 Supports Arrays, Objects, Arrays of Objects, Dates, and primitive data types

## Installation

```shell
npm install @davstack/use-url
```
or
```shell
pnpm add @davstack/use-url
```
or
```shell
yarn add @davstack/use-url
```

## Usage

```tsx
import { useUrl } from '@davstack/use-url';

export default () => {
	const { params, setParam } = useUrl();
	const { name } = params;

	return (
		<>
			<h1>Hello, {name || 'anonymous visitor'}!</h1>
			<input value={name || ''}
				onChange={()=>setParam('name', e.target.value))}
			 />
			<button
				onClick={() => setParam('name', null)}
			>
			Clear
			</button>
		</>
	);
};
```

![](./useQueryState.gif)

Example: simple counter stored in the URL:

```tsx
import React from 'react';
import { useUrl } from '@davstack/use-url';

export default function CounterComponent() {
	const { params, setParam } = useUrl();

	const handleReset = () => setParam('count', 0);
	const handleIncrement = () => setParam('count', (c) => c ?? 0 + 1);
	const handleDecrement = () => setParam('count', (c) => c ?? 0 - 1);
	const handleClear = () => setParam('count', null);

	return (
		<>
			<pre>count: {count ?? 'Not set'}</pre>
			<button onClick={handleReset}>Reset</button>
			<button onClick={handleIncrement}>+</button>
			<button onClick={handleDecrement}>-</button>
			<button onClick={handleClear}>Clear</button>
		</>
	);
}
```

## Types

```ts
import '~/@davstack/use-url/src/types/params';

declare module '~/@davstack/use-url/src/types/params' {
	export interface Params {
		startDate: Date;
		endDate: Date;
		// Add more custom properties as needed
	}
}
```

## Caveats

Because the Next.js router is not available in an SSR context, this
hook will always return `null` (or the default value if supplied) on SSR/SSG.
