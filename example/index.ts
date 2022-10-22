import ListSelectionStateManager, { Config } from '../src'

document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from({ length: 19 - 0 + 1 }, (_, i) => ({ value: 0 + i }))

  const setSelectedItems = selectedItems => {
    document.querySelectorAll('li').forEach(li => {
      if (
        selectedItems
          .map(item => item.value.toString())
          .includes(li.dataset.value)
      ) {
        li.classList.add('selected')
      } else {
        li.classList.remove('selected')
      }
    })
  }

  const ul = document.createElement('ul')
  const lm = new ListSelectionStateManager(items)
  for (let i = 0; i < 20; i++) {
    const li = document.createElement('li')
    li.addEventListener('click', e => {
      const config: Config = {
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
      }
      lm.selectItem(items[i], config)
      setSelectedItems(lm.getSelectedItems())
    })

    li.innerText = `Item ${i}`
    li.dataset.value = i.toString()
    ul.appendChild(li)
  }

  document.getElementById('app')?.appendChild(ul)

  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

    e.preventDefault()

    const config = {
      shiftKey: e.shiftKey,
    }

    if (e.key === 'ArrowDown') {
      lm.nextItem(config)
    } else {
      lm.previousItem(config)
    }

    setSelectedItems(lm.getSelectedItems())
  })
})
