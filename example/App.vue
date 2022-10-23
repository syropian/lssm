<template>
  <h1>lssm</h1>
  <ul>
    <li
      v-for="item in items"
      :key="item.value"
      @click="selectItem(item, $event)"
      :class="{ 'bg-blue-500 text-white': itemIsSelected(item) }"
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
