<h1 align="center">
	🌐 useUrl: Next.js URL State Management 🔗
</h1>

<h2 align="center">
	Easily read and write complex data types as URL query parameters
</h2>

<br/>

<div align="center">

[![NPM](https://img.shields.io/npm/v/@davstack/use-url?color=red)](https://www.npmjs.com/package/@davstack/use-url)
[![Continuous Integration](https://github.com/DawidWraga/use-url/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/DawidWraga/use-url/actions/workflows/publish.yml/)

</div>

<br/>

## Features

- 🌐 Simplified global state management: the URL serves as the single source of truth.
- 🔗 Supports Arrays, Objects, Arrays of Objects, Dates, and primitive data types.
- 🟦 Supports TypeScript, with custom param types.

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
