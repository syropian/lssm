# vite-vanilla-ts-starter

> A starter template for building vanilla TypeScript libraries with Vite, Vitest, ESLint, and Prettier.

---

## Example Readme

# my-lib [![Tests](https://github.com/syropian/vite-vanilla-ts-starter/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/syropian/vite-vanilla-ts-starter/actions/workflows/test.yml)

> A description of your library here.

## Install

```
$ npm install my-lib --save
```

**or** include it in a `<script>` tag, hosted by [unpkg](https://unpkg.com).

```js
<script src="https://unpkg.com/my-lib/dist/my-lib.iife.js" />
```

## Usage

```ts
import doSomething from 'my-lib'

const x = 5
doSomething(x) // result
```

## API

### doSomething(number)

#### count

Type: `number`

The number that you want to do something with.

## Development

```bash
# To run the tests
$ pnpm test
# or
$ pnpm run test:watch

# To publish the dist files
$ pnpm run build
```

## License

MIT © [Collin Henderson](https://github.com/syropian)
