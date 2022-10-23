<template>
  <div class="max-w-sm w-full mx-auto mt-20">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold text-gray-700">lssm</h1>
      <a
        href="https://github.com/syropian/lssm"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block text-gray-700 transition-colors hover:text-blue-500"
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
          ></path></svg
      ></a>
    </div>
    <h2 class="text-gray-500 text-lg mt-2">
      An opinionated list selection state manager
    </h2>
    <div class="mt-4 pt-4 border-t border-gray-100 leading-loose prose">
      <ul>
        <li>Click an item to select it</li>
        <li>
          <kbd class="text-xs">ctrl</kbd> or
          <kbd class="text-xs">cmd</kbd> click an item to toggle it
        </li>
        <li>
          <kbd class="text-xs">shift</kbd> or
          <kbd class="text-xs">cmd</kbd> click an item to select the items as a
          range
        </li>
        <li>Use the arrow keys to select the next or previous item</li>
        <li>
          Use <kbd class="text-xs">shift</kbd> plus the arrow keys to
          multi-select adjacent items
        </li>
      </ul>
    </div>
    <div class="flex items-center gap-x-4 mt-5">
      <button
        type="button"
        class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-gray-100 relative active:top-px active:shadow-none"
        @click="selectAll"
      >
        Select all
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-gray-100 relative active:top-px active:shadow-"
        @click="selectNone"
      >
        Clear selection
      </button>
    </div>
    <ul
      class="rounded-lg border-4 border-gray-200 overflow-hidden mt-5"
      role="listbox"
      aria-multiselectable="true"
      aria-label="Select one or more items"
    >
      <li
        v-for="item in items"
        :key="item.value"
        @click="selectItem(item, $event)"
        class="px-4 py-2 cursor-pointer text-sm even:bg-gray-100 select-none"
        :class="{
          'bg-blue-500 even:bg-blue-500 text-white peer-[.is-dirty]':
            itemIsSelected(item),
        }"
        role="option"
        :aria-selected="itemIsSelected(item) || undefined"
      >
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { ListSelectionStateManager } from '../src'

type Item = {
  value: number
}

const items = ref(
  Array.from({ length: 9 - 0 + 1 }, (_, i) => ({ value: 0 + i }))
) as Ref<Item[]>
const selectedItems = ref<Item[]>([])

const lssm = new ListSelectionStateManager(items.value)

const selectItem = (item: Item, e: MouseEvent) => {
  const { ctrlKey, metaKey, shiftKey } = e

  lssm.selectItem(item, {
    ctrlKey,
    metaKey,
    shiftKey,
  })

  selectedItems.value = lssm.getSelectedItems()
}

const itemIsSelected = (item: Item) => {
  return !!selectedItems.value.find(
    selectedItem => item.value === selectedItem.value
  )
}

const selectAll = () => {
  lssm.selectAll()
  selectedItems.value = lssm.getSelectedItems()
}

const selectNone = () => {
  lssm.clearSelection()
  selectedItems.value = lssm.getSelectedItems()
}

onMounted(() => {
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

    e.preventDefault()

    const config = {
      shiftKey: e.shiftKey,
    }

    if (e.key === 'ArrowDown') {
      lssm.nextItem(config)
    } else {
      lssm.previousItem(config)
    }

    selectedItems.value = lssm.getSelectedItems()
  })
})
</script>

<style lang="postcss">
kbd {
  @apply bg-gray-100 rounded border-gray-300 shadow border p-1 text-xs;
}
</style>
