<template>
  <h1>lssm</h1>
  <ul>
    <li
      v-for="item in items"
      :key="item.value"
      @click="selectItem(item, $event)"
      :class="{ selected: itemIsSelected(item) }"
    >
      {{ item.value }}
    </li>
  </ul>
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

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  width: 100vw;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 225px;
  border: 1px solid #ddd;
}

ul li {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  font-size: 14px;
  user-select: none;
}

ul li:nth-child(even) {
  background-color: #f4f5f5;
}

ul li.selected {
  background-color: #0062e1;
  color: #fff;
}
</style>
