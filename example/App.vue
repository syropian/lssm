<template>
  <div
    class="sm:max-w-screen-md w-full px-4 sm:px-0 mx-auto mt-12 sm:mt-20 flex flex-col sm:flex-row gap-y-5 sm:gap-x-12 sm:gap-y-0"
  >
    <div class="w-full sm:w-1/2">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-semibold text-gray-700 dark:text-gray-300">
          lssm
        </h1>
        <a
          href="https://github.com/syropian/lssm"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block text-gray-700 dark:text-gray-300 transition-colors hover:text-blue-500"
          aria-label="GitHub"
          ><svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-6 h-6 stroke-current"
          >
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            ></path>
          </svg>
        </a>
      </div>
      <h2 class="text-gray-500 dark:text-gray-400 text-lg mt-2">
        An opinionated list selection state manager
      </h2>

      <div
        class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 leading-loose prose dark:prose-invert"
      >
        <ul>
          <li>Click an item to select it</li>
          <li>
            <kbd class="text-xs">ctrl</kbd> or
            <kbd class="text-xs">cmd</kbd> click an item to toggle it
          </li>
          <li>
            <kbd class="text-xs">shift</kbd> click an item to select the items
            as a range
          </li>
          <li>
            Use the up/down arrow keys to select the next or previous item
          </li>
          <li>
            Use <kbd class="text-xs">shift</kbd> plus the up/down arrow keys to
            multi-select adjacent items
          </li>
        </ul>
      </div>
    </div>
    <div class="w-full sm:w-1/2">
      <div class="flex items-center gap-x-4 mt-5">
        <button
          type="button"
          class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-gray-100 relative active:top-px active:shadow-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          @click="selectAll"
        >
          Select all
        </button>

        <button
          type="button"
          class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-gray-100 relative active:top-px active:shadow-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-600"
          @click="selectNone"
        >
          Clear selection
        </button>
      </div>
      <ul
        class="rounded-lg border-4 border-gray-200 dark:border-gray-700 overflow-hidden mt-5 max-h-[368px] overflow-y-auto"
        role="listbox"
        aria-multiselectable="true"
        aria-label="Select one or more items"
      >
        <li
          v-for="item in items"
          :key="item.value"
          @click="selectItem(item, $event)"
          class="px-2 py-2 cursor-pointer text-sm select-none flex items-center gap-x-1"
          :class="{
            'bg-blue-500 even:bg-blue-500 text-white': itemIsSelected(item),
            'even:bg-gray-100 text-gray-800 dark:even:bg-gray-800 dark:text-gray-400':
              !itemIsSelected(item),
          }"
          role="option"
          :aria-selected="itemIsSelected(item) || undefined"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
            :class="itemIsSelected(item) ? 'opacity-75' : 'opacity-50'"
            aria-hidden="true"
          >
            <path
              d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
            />
          </svg>

          Item {{ item.value }}
        </li>
      </ul>
    </div>
  </div>
  <footer
    class="sm:max-w-screen-md w-full px-4 sm:px-0 mx-auto mt-12 sm:mt-20 text-sm text-gray-700 dark:text-gray-400 mb-5"
  >
    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
      &copy; {{ new Date().getFullYear() }}
      <a
        href="https://syropia.net"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500 font-bold no-underline hover:underline"
        >Collin Henderson</a
      >
    </div>
  </footer>
</template>
<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { ListSelectionStateManager } from '../src'

type Item = {
  value: number
}

const TOTAL_ITEMS = 10

const items = ref(
  Array.from({ length: TOTAL_ITEMS }, (_, i) => ({ value: 0 + i }))
) as Ref<Item[]>
const selectedItems = ref<Item[]>([])

const lssm = new ListSelectionStateManager(items.value)

const selectItem = (item: Item, e: MouseEvent) => {
  const { ctrlKey, metaKey, shiftKey } = e

  lssm.select(item, {
    ctrlKey,
    metaKey,
    shiftKey,
  })

  selectedItems.value = lssm.get()
}

const itemIsSelected = (item: Item) => {
  return !!selectedItems.value.find(
    selectedItem => item.value === selectedItem.value
  )
}

const selectAll = () => {
  lssm.selectAll()
  selectedItems.value = lssm.get()
}

const selectNone = () => {
  lssm.clear()
  selectedItems.value = lssm.get()
}

onMounted(() => {
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

    e.preventDefault()

    const config = {
      shiftKey: e.shiftKey,
    }

    if (e.key === 'ArrowDown') {
      lssm.next(config)
    } else {
      lssm.previous(config)
    }

    selectedItems.value = lssm.get()
  })
})
</script>

<style lang="postcss">
kbd {
  @apply bg-gray-100 rounded border-gray-300 shadow border p-1 text-xs;
}

@media (prefers-color-scheme: dark) {
  kbd {
    @apply bg-gray-700 border-gray-600 text-gray-300;
  }
}
</style>
