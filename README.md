# lssm [![Tests](https://github.com/syropian/lssm/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/syropian/lssm/actions/workflows/test.yml)

> Opionated list selection state manager.

## ⚠️ This library is currently under development and is _not_ production-ready. Use at your own risk. ⚠️

`lssm` is small library that provides a simple API for managing the selection state of a list of items. It allows you to easily build selectable list UIs that support complex multi-select rules that you would see in something like the macOS Finder. It was written in vanilla TypeScript, and can be freely used alongside your favourite JavaScript framework.

## Install

```
$ npm install lssm --save
```

**or** include it in a `<script>` tag, hosted by [unpkg](https://unpkg.com).

```js
<script src="https://unpkg.com/lssm/dist/lssm.iife.js" />
```

## Usage

Usage instructions coming soon. See `/example/index.ts` and `/test/index.test.ts` for example usage.

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
