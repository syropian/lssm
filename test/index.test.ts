import { describe, test, expect } from 'vitest'
import ListSelectionStateManager, { Config } from '../src'

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

describe('list-selection-state', () => {
  describe('Single-selection', () => {
    test('Selecting a single item with no modifier key pressed ', () => {
      const listFixture = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]
      const lssm = new ListSelectionStateManager(listFixture)

      lssm.selectItem(5)
      expect(lssm.getSelectedItems()).toEqual([5])

      lssm.selectItem(9)
      expect(lssm.getSelectedItems()).toEqual([9])
    })

    test('Selecting a single unselected item with the meta key pressed appends the item to the current selection', () => {
      const listFixture = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]
      const config: Config = {
        metaKey: true,
      }
      const lm = new ListSelectionStateManager(listFixture)

      lm.selectItem(5, config)
      expect(lm.getSelectedItems()).toEqual([5])

      lm.selectItem(9, config)
      expect(lm.getSelectedItems()).toEqual([5, 9])
    })

    test('Selecting a single selected item with the meta key pressed removes the item to the current selection', () => {
      const listFixture = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]
      const config: Config = {
        metaKey: true,
      }
      const lm = new ListSelectionStateManager(listFixture)

      lm.selectItem(5, config)
      lm.selectItem(6, config)
      lm.selectItem(9, config)
      lm.selectItem(5, config)

      expect(lm.getSelectedItems()).toEqual([6, 9]) //nice
    })
  })

  describe('Multi-selection', () => {
    test('If no item is selected, all items from index 0 to the item that was clicked should be selected', () => {
      const listFixture = range(0, 19)
      const config: Config = {
        shiftKey: true,
      }
      const lm = new ListSelectionStateManager(listFixture)

      lm.selectItem(5, config)
      expect(lm.getSelectedItems()).toEqual(range(0, 5))
    })

    test('If an item is already selected and a non-selected item is clicked, it should select all items between them, inclusive to both the initial selected item, and the item clicked', () => {
      const listFixture = range(0, 19)
      const config: Config = {
        shiftKey: true,
      }
      const lm = new ListSelectionStateManager(listFixture)

      lm.selectItem(5)
      lm.selectItem(10, config)
      expect(lm.getSelectedItems()).toEqual(range(5, 10))

      lm.selectItem(13, config)
      expect(lm.getSelectedItems()).toEqual(range(5, 13))

      lm.clearSelection()

      lm.selectItem(15)
      lm.selectItem(10, config)
      expect(lm.getSelectedItems()).toEqual(range(10, 15))

      lm.selectItem(7, config)
      expect(lm.getSelectedItems()).toEqual(range(7, 15))
    })

    test('Monkey test #1', () => {
      const listFixture = range(0, 19)
      const shiftConfig: Config = {
        shiftKey: true,
      }
      const metaConfig: Config = {
        metaKey: true,
      }

      const lm = new ListSelectionStateManager(listFixture)
      lm.selectItem(2)
      lm.selectItem(6, metaConfig)
      expect(lm.getSelectedItems()).toEqual([2, 6])

      lm.selectItem(12, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([2, ...range(6, 12)])

      lm.clearSelection()

      lm.selectItem(2)
      lm.selectItem(12, metaConfig)
      lm.selectItem(7, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([2, ...range(7, 12)])

      lm.clearSelection()

      lm.selectItem(10)
      lm.selectItem(4, metaConfig)
      lm.selectItem(14, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(4, 14))

      lm.clearSelection()

      lm.selectItem(10)
      lm.selectItem(14, metaConfig)
      lm.selectItem(4, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(4, 14))
    })

    test('Monkey test #2', () => {
      const listFixture = range(0, 19)
      const shiftConfig: Config = {
        shiftKey: true,
      }
      const metaConfig: Config = {
        metaKey: true,
      }

      const lm = new ListSelectionStateManager(listFixture)

      lm.selectItem(10)
      lm.selectItem(14, shiftConfig)
      lm.selectItem(6, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(6, 10))

      lm.clearSelection()

      lm.selectItem(2)
      lm.selectItem(10, metaConfig)
      lm.selectItem(14, shiftConfig)
      lm.selectItem(6, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([2, ...range(6, 10)])

      lm.clearSelection()

      lm.selectItem(18)
      lm.selectItem(10, metaConfig)
      lm.selectItem(14, shiftConfig)
      lm.selectItem(6, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([...range(6, 10), 18])

      lm.clearSelection()

      lm.selectItem(15)
      lm.selectItem(10, metaConfig)
      lm.selectItem(14, shiftConfig)
      lm.selectItem(6, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(6, 10))

      lm.clearSelection()

      lm.selectItem(10)
      lm.selectItem(6, shiftConfig)
      lm.selectItem(14, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(10, 14))

      lm.selectItem(18)
      lm.selectItem(10, metaConfig)
      lm.selectItem(6, shiftConfig)
      lm.selectItem(14, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([...range(10, 14), 18])
    })

    test('Monkey test #3', () => {
      const listFixture = range(0, 19)
      const shiftConfig: Config = {
        shiftKey: true,
      }
      const metaConfig: Config = {
        metaKey: true,
      }

      const lm = new ListSelectionStateManager(listFixture)

      lm.selectItem(4)
      lm.selectItem(12, shiftConfig)
      lm.selectItem(8, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(4, 8))

      lm.clearSelection()

      lm.selectItem(2)
      lm.selectItem(18, shiftConfig)
      lm.selectItem(16, metaConfig)
      lm.selectItem(15, metaConfig)
      lm.selectItem(12, metaConfig)
      lm.selectItem(11, metaConfig)
      lm.selectItem(6, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([...range(6, 13), 17, 18])

      lm.clearSelection()

      lm.selectItem(18)
      lm.selectItem(2, shiftConfig)
      lm.selectItem(4, metaConfig)
      lm.selectItem(5, metaConfig)
      lm.selectItem(8, metaConfig)
      lm.selectItem(9, metaConfig)
      lm.selectItem(14, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([2, 3, 6, 7, ...range(10, 14)])

      lm.clearSelection()

      lm.selectItem(10)
      lm.selectItem(16, shiftConfig)
      lm.selectItem(14, metaConfig)
      lm.selectItem(4, shiftConfig)
      expect(lm.getSelectedItems()).toEqual(range(4, 15))

      lm.clearSelection()

      lm.selectItem(8)
      lm.selectItem(2, shiftConfig)
      lm.selectItem(6, metaConfig)
      lm.selectItem(14, shiftConfig)
      expect(lm.getSelectedItems()).toEqual([...range(2, 5), ...range(7, 14)])
    })
  })
})
