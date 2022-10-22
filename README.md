# lssm [![Tests](https://github.com/syropian/lssm/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/syropian/lssm/actions/workflows/test.yml)

> Opionated list selection state manager.

## Install

```
$ npm install lssm --save
```

**or** include it in a `<script>` tag, hosted by [unpkg](https://unpkg.com).

```js
<script src="https://unpkg.com/lssm/dist/lssm.iife.js" />
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
