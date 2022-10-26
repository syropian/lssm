# lssm [![Tests](https://github.com/syropian/lssm/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/syropian/lssm/actions/workflows/test.yml)

> Opinionated list selection state manager.

`lssm` is small library that provides a simple command-driven API for managing the selection state of a list of items. It allows you to easily build a selectable list UI that supports complex multi-select rules modelled after the macOS Finder. It was written in vanilla TypeScript, and can be freely used alongside your favourite JavaScript framework, or no framework at all!

[Check out the demo](https://lssm-js.netlify.app/)

## Can I customize the style my lists?

`lssm` works purely with data and has no opinions on your UI layer. You can use a list manager to return the currently selected items, compare them against the orignal list of items, and render your UI accordingly.

## Install

```
npm install lssm --save
```

**or** include it in a `<script>` tag, hosted by [unpkg](https://unpkg.com).

```js
<script src="https://unpkg.com/lssm/dist/lssm.iife.js" />
```

## Usage

To begin, you'll need to create a list manager, and pass it your list of selectable items.

```ts
import { ListSelectionStateManager as Lssm } from 'lssm'

const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
  // etc...
]

const listManager = new Lssm(items)
```

### Commands

Once you have a manager instance, you can use it to manage the selection state of your list using a few basic commands.

> **Note**
> Some commands accept a modifier config. This config is an object that specifies whether shift, ctrl, or command is being pressed while the command is being executed. This data can easily be extrapolated from the event object of various event handlers such as click and keydown. If you don't pass a modifier config, the command will be run as if no modifier keys are being pressed.

#### `select(item: T, config: ModifierConfig): this`

Selects a specific item in the list. If the ctrl/cmd modifier is passed, the item will be toggled. If the shift modifier is passed, a range of items will be selected using a predetermined set of rules.

**Example**

```ts
document.querySelectorAll('.list-item').forEach(item => {
  item.addEventListener('click', event => {
    const { ctrlKey, metaKey, shiftKey } = event
    listManager.select(item.dataset.listItem, {
      ctrlKey,
      metaKey,
      shiftKey,
    })
  })
})
```

#### `next(config: ModifierConfig): this`

Selects the next item in the list. If the shift modifier is passed, the next adjacent item will be toggled using a predetermined set of rules.

#### `previous(config: ModifierConfig): this`

Selects the previous item in the list. If the shift modifier is passed, the previous adjacent item will be toggled using a predetermined set of rules.

**Example**

```ts
document.addEventListener('keydown', e => {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

  e.preventDefault()

  const config = {
    shiftKey: e.shiftKey,
  }

  if (e.key === 'ArrowDown') {
    listManager.next(config)
  } else {
    listManager.previous(config)
  }

  console.log(listManager.get())
})
```

#### `get(): T[]`

Returns the currently selected items in the list.

**Example**

```ts
const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const listManager = new Lssm(items)

// Note how commands can be chained together
listManager.select(1).select(4, { shiftKey: true }).select(8, { metaKey: true })

console.log(listManager.get()) // [1, 2, 3, 4, 8]
```

#### `getIndices(): number[]`

Similar to `get()` but returns the indices of the selected items instead of the items themselves.

**Example**

```ts
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
]

const listManager = new Lssm(items)
listManager.select(1).select(3, { shiftKey: true }).select(5, { metaKey: true })

console.log(listManager.getIndices()) // [0, 1, 2, 5]
```

#### `set(items: T[]): this`

Allows you to manually set the selected items in the list.

**Example**

```ts
const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const listManager = new Lssm(items)

listManager.set([1, 5, 6, 7])

console.log(listManager.get()) // [1, 5, 6, 7]
```

#### `selectAll(): this`

Selects all items in the list.

#### `clear(): this`

Deselcts all items in the list.

## Development

```bash
# To run the tests
pnpm test
# or
pnpm run test:watch

# To run the example
pnpm run dev

# To publish the dist files
pnpm run build
```

## License

MIT © [Collin Henderson](https://github.com/syropian)
