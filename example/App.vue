<template>
  <div class="max-w-sm w-full mx-auto mt-20">
    <h1 class="text-3xl font-semibold text-gray-700">lssm</h1>
    <h2 class="text-gray-500 text-lg">
      An opinionated list selection state manager
    </h2>
    <p class="mt-4 text-gray-800 pt-4 border-t border-gray-100 leading-loose">
      Click an item to select it. You may press
      <kbd
        class="rounded bg-gray-100 text-gray-700 p-1 text-xs border border-gray-300 shadow"
        >cmd</kbd
      >
      or
      <kbd
        class="rounded bg-gray-100 text-gray-700 p-1 text-xs border border-gray-300 shadow"
        >ctrl</kbd
      >
      to toggle individual items. You may also hold
      <kbd
        class="rounded bg-gray-100 text-gray-700 p-1 text-xs border border-gray-300 shadow"
        >shift</kbd
      >
      to select a range of items.
    </p>
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
